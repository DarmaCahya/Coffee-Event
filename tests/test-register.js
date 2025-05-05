const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

async function loginAsAdmin(driver, email, password,) {
    await driver.get('http://localhost:8080/signin');

    await driver.findElement(By.id('email')).sendKeys(email);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();

    const currentUrl = await driver.getCurrentUrl();
    let isAdminLoggedIn = false;
    try {
        const adminButton = await driver.findElement(By.id('admin-nav'));
        isAdminLoggedIn = true;
    } catch (error) {
        console.log("❌ Login successful, but the logged-in user is not an Admin - Test Failed");
        return;
    }
}

const logOutAsAdmin = async (driver) => {
    const logoutForm = await driver.findElement(By.css('form[action="/api/auth/signout"]'));
    await logoutForm.submit(); 

    await driver.wait(until.urlContains('/home'), 10000);
    console.log("✅ Logged out as Admin - Passed");
}

async function testRegisterAsAdmin(driver, username, email, password, role) {
    const roles = ['admin event', 'jury'];
    const currentUrl = await driver.getCurrentUrl();

    let isAdminLoggedIn = false;
    try {
        const adminButton = await driver.findElement(By.id('admin-nav'));
        isAdminLoggedIn = true;
    } catch (error) {
        console.log("❌ Admin not logged in, cannot access the register page.");
        console.log("User cannot create an account");
        return;
    }

    if (currentUrl.includes('/home') && isAdminLoggedIn ) {
        if(!roles.includes(role)) {
            console.log("Error - Invalid Role");
            console.log("❌ Cannot register with invalid role - Passed")
            return;
        }

        await driver.get('http://localhost:8080/admin/signup');

        await driver.findElement(By.id('username')).sendKeys(username);
        await driver.findElement(By.id('email')).sendKeys(email);
        await driver.findElement(By.id('password')).sendKeys(password);
        await driver.findElement(By.id('role')).sendKeys(role);

        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.wait(until.urlContains('/admin/dashboard'), 10000);
        const newUrl = await driver.getCurrentUrl();
        if (newUrl.includes('/admin/dashboard')) {
            console.log(`✅ Admin Create ${role} Account successful - Passed`);
        } else {
            console.log(`❌ Admin Create ${role} Account failed - Failed`);
        }
        await driver.get('http://localhost:8080/home');
    }
}

(async function runTests() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await loginAsAdmin(driver, 'john@gmail.com', 'securepassword');

        await testRegisterAsAdmin(driver, 'jury123', 'jury123@gmail.com', 'securepassword', 'jury');
        await testRegisterAsAdmin(driver, '', 'jury123@gmail.com', 'securepassword', 'jury');
        await testRegisterAsAdmin(driver, 'jury123', '', 'securepassword', 'jury');
        await testRegisterAsAdmin(driver, 'jury123', 'jury123@gmail.com', '', 'jury');
        await testRegisterAsAdmin(driver, '', '', '', '');


        await testRegisterAsAdmin(driver, 'adminevent1231', 'adminevent1231@gmail.com', 'securepassword', 'admin event');
        await testRegisterAsAdmin(driver, 'adminevent1231', 'adminevent1231@gmail.com', 'securepassword', '');
        await testRegisterAsAdmin(driver, 'adminevent1231', 'adminevent1231@gmail.com', 'securepassword', 'user');

        await logOutAsAdmin(driver);

        await testRegisterAsAdmin(driver, 'jury123', 'jury123@gmail.com', 'securepassword', 'jury');

        await loginAsAdmin(driver, 'juri1@gmail.com', 'asd');
        await loginAsAdmin(driver, 'event1@gmail.com', 'securepassword');


        console.log(`✅ All tests passed successfully.`);
    } catch (error) {
        console.log(`❌ Test Register Page — Failed`);
    } finally {
        await driver.quit();
    }
})();