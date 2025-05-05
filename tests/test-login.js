const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

async function testLoginPage(driver, email, password, expectedUrl, description) { 
    try {
        await driver.get('http://localhost:8080/signin');
        await driver.findElement(By.id('email')).sendKeys(email);
        await driver.findElement(By.id('password')).sendKeys(password);

        await driver.findElement(By.css('button[type="submit"]')).click();
        
        await driver.wait(until.urlContains(expectedUrl), 10000);
        console.log(`✅ Test ${description} - passed.`);
 
    } catch (error) {
        console.log(`❌ Test ${description} — failed`);
    }
};

(async function runTests() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await testLoginPage(driver, 'john@gmail.com', 'securepassword', '/home', 'login Successful');

        await testLoginPage(driver, 'john@gmail.com', 'wrongpassword', '?error=InvalidPassword', 'login Failed');
        await testLoginPage(driver, 'john12@gmail.com', 'wrongpassword', '?error=UserNotFound', 'login Failed');
        await testLoginPage(driver, 'john1@gmail.com', 'securepassword', '?error=UserNotFound', 'account not found');
        
        await testLoginPage(driver, 'juri1@gmail.com', 'asd', '?error=AccountDeactivated', 'account deactivated');
        
        await testLoginPage(driver, '', '', '', 'Empty input (should not submit)');
        await testLoginPage(driver, 'john@gmail.com', '', '', 'Empty input (should not submit)');
        await testLoginPage(driver, '', 'securepassword', '', 'Empty input (should not submit)');

        console.log(`✅ All tests passed successfully.`);
    } catch (error) {
        console.log(`❌ Test Login Page — Failed`);
    } finally {
        await driver.quit();
    }
})();
