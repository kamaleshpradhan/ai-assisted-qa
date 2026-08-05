import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { validUser, invalidUsers } from '@fixtures/users.fixture';
import { allure } from 'allure-playwright';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should display login page correctly @smoke @ui', async () => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Login page display');
    await allure.severity('critical');

    await allure.step('Verify login page elements are visible', async () => {
      await loginPage.expectLoginPageLoaded();
    });

    await allure.step('Verify page title', async () => {
      const title = await loginPage.getTitle();
      expect(title).toContain('Login');
    });
  });

  test('should login successfully with valid credentials @smoke @ui', async () => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Successful login');
    await allure.severity('critical');

    await allure.step('Enter valid credentials', async () => {
      await loginPage.enterEmail(validUser.email);
      await loginPage.enterPassword(validUser.password);
    });

    await allure.step('Click submit button', async () => {
      await loginPage.clickSubmit();
    });

    await allure.step('Verify successful login redirect', async () => {
      await expect(loginPage.page).toHaveURL(/.*dashboard/);
    });
  });

  test('should show error with invalid email format @regression @ui', async () => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Invalid email validation');
    await allure.severity('normal');

    await allure.step('Enter invalid email format', async () => {
      await loginPage.enterEmail(invalidUsers.invalidEmail.email);
      await loginPage.enterPassword(invalidUsers.invalidEmail.password);
    });

    await allure.step('Click submit button', async () => {
      await loginPage.clickSubmit();
    });

    await allure.step('Verify error message is displayed', async () => {
      await expect(loginPage.page.getByTestId('error-message')).toContainText(
        'Please enter a valid email address'
      );
    });
  });

  test('should show error with wrong password @regression @ui', async () => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Wrong password validation');
    await allure.severity('normal');

    await allure.step('Enter valid email with wrong password', async () => {
      await loginPage.login(invalidUsers.wrongPassword.email, invalidUsers.wrongPassword.password);
    });

    await allure.step('Verify error message is displayed', async () => {
      await expect(loginPage.page.getByTestId('error-message')).toContainText(
        'Invalid email or password'
      );
    });
  });

  test('should show error when email is empty @regression @ui', async () => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Empty field validation');
    await allure.severity('normal');

    await allure.step('Leave email empty and enter password', async () => {
      await loginPage.enterPassword(invalidUsers.emptyEmail.password);
      await loginPage.clickSubmit();
    });

    await allure.step('Verify error message is displayed', async () => {
      await expect(loginPage.page.getByTestId('error-message')).toContainText('Email is required');
    });
  });

  test('should show error when password is empty @regression @ui', async () => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Empty field validation');
    await allure.severity('normal');

    await allure.step('Enter email and leave password empty', async () => {
      await loginPage.enterEmail(invalidUsers.emptyPassword.email);
      await loginPage.clickSubmit();
    });

    await allure.step('Verify error message is displayed', async () => {
      await expect(loginPage.page.getByTestId('error-message')).toContainText(
        'Password is required'
      );
    });
  });

  test('should navigate to forgot password page @regression @ui', async () => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Forgot password navigation');
    await allure.severity('minor');

    await allure.step('Click forgot password link', async () => {
      await loginPage.clickForgotPassword();
    });

    await allure.step('Verify navigation to forgot password page', async () => {
      await expect(loginPage.page).toHaveURL(/.*forgot-password/);
    });
  });
});
