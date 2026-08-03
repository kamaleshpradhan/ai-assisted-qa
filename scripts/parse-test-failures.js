/**
 * Parse Test Failures from Playwright Reports
 * Extracts failed test details from junit.xml and JSON reports
 */

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

async function parseJUnitXml() {
    const junitPath = path.join(process.cwd(), 'test-results', 'junit.xml');

    if (!fs.existsSync(junitPath)) {
        console.error('❌ junit.xml not found at:', junitPath);
        return [];
    }

    const junitXml = fs.readFileSync(junitPath, 'utf8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(junitXml);

    const failures = [];

    // Handle different junit.xml structures
    const testsuites = result.testsuites?.testsuite || result.testsuite || [];
    const suitesArray = Array.isArray(testsuites) ? testsuites : [testsuites];

    suitesArray.forEach(suite => {
        const testcases = suite.testcase || [];
        const casesArray = Array.isArray(testcases) ? testcases : [testcases];

        casesArray.forEach(testcase => {
            if (testcase.failure || testcase.error) {
                const failureInfo = testcase.failure?.[0] || testcase.error?.[0];
                failures.push({
                    title: testcase.$.name,
                    file: testcase.$.classname?.replace(/\./g, '/') + '.spec.ts' || 'unknown',
                    suite: suite.$.name,
                    error: failureInfo?._ || failureInfo?.$.message || 'Unknown error',
                    errorType: failureInfo?.$.type || 'UnknownError',
                    duration: parseFloat(testcase.$.time || 0) * 1000,
                });
            }
        });
    });

    return failures;
}

async function parsePlaywrightJson() {
    const jsonReports = [];
    const resultsDir = path.join(process.cwd(), 'test-results');

    if (!fs.existsSync(resultsDir)) {
        return [];
    }

    // Look for Playwright JSON reporter output
    const files = fs.readdirSync(resultsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'junit.xml');

    for (const file of jsonFiles) {
        try {
            const content = fs.readFileSync(path.join(resultsDir, file), 'utf8');
            const report = JSON.parse(content);

            if (report.suites) {
                parsePlaywrightSuites(report.suites, jsonReports);
            }
        } catch (err) {
            // Skip invalid JSON files
            console.warn(`⚠️  Skipping invalid JSON file: ${file}`);
        }
    }

    return jsonReports;
}

function parsePlaywrightSuites(suites, failures) {
    for (const suite of suites) {
        if (suite.specs) {
            for (const spec of suite.specs) {
                if (spec.tests) {
                    for (const test of spec.tests) {
                        if (test.results) {
                            for (const result of test.results) {
                                if (result.status === 'failed' || result.status === 'timedOut') {
                                    failures.push({
                                        title: test.title,
                                        file: suite.file,
                                        suite: suite.title,
                                        error: result.error?.message || 'Test failed',
                                        errorType: result.error?.name || 'TestFailure',
                                        duration: result.duration,
                                        attachments: result.attachments?.map(a => ({
                                            name: a.name,
                                            path: a.path,
                                            contentType: a.contentType
                                        })) || []
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        // Recurse into nested suites
        if (suite.suites) {
            parsePlaywrightSuites(suite.suites, failures);
        }
    }
}

async function main() {
    console.log('🔍 Parsing test failures...\n');

    // Try both formats
    const junitFailures = await parseJUnitXml();
    const jsonFailures = await parsePlaywrightJson();

    // Merge and deduplicate
    const allFailures = [...junitFailures, ...jsonFailures];
    const uniqueFailures = allFailures.reduce((acc, failure) => {
        const key = `${failure.file}:${failure.title}`;
        if (!acc.some(f => `${f.file}:${f.title}` === key)) {
            acc.push(failure);
        }
        return acc;
    }, []);

    if (uniqueFailures.length === 0) {
        console.log('✅ No test failures found!');
        process.exit(0);
    }

    console.log(`❌ Found ${uniqueFailures.length} failed test(s):\n`);
    uniqueFailures.forEach((failure, i) => {
        console.log(`${i + 1}. ${failure.title}`);
        console.log(`   File: ${failure.file}`);
        console.log(`   Error: ${failure.errorType}`);
        console.log('');
    });

    // Output as JSON for GitHub Actions
    console.log(JSON.stringify(uniqueFailures));
}

main().catch(err => {
    console.error('❌ Error parsing test failures:', err);
    process.exit(1);
});
