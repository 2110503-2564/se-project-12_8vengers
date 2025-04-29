import { test, expect } from '@playwright/test';
test.setTimeout(50000);
test('Rating Co-Working Space', async ({ page }) => {
  await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
  await page.fill('input[name="email"]', 'Cat@gmail.com');
  await page.fill('input[name="password"]', '12345678');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });

  await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();

  const secondItem = page.locator('a[href^="/coworkingspace/"]').nth(1);
  await secondItem.click();

  
  await page.locator('label[for=":r4:"]').click();
  await expect(page.locator('text=Rating submitted!')).toBeVisible();
  await page.waitForTimeout(1000);

  await expect(page.locator('label[for=":r1:"]')).toBeVisible();
  await page.locator('label[for=":r1:"]').click();
  await expect(page.locator('text=Rating submitted!')).toBeVisible();
  await page.waitForTimeout(1500);


  await expect(page.locator('label[for=":r5:"]')).toBeVisible();
  await page.locator('label[for=":r5:"]').click();
  await expect(page.locator('text=Rating submitted!')).toBeVisible();
  
  await page.waitForResponse(
    res => res.url().includes('/ratings/average/') && 
    res.request().method() === 'GET' 
  );
  await page.waitForResponse(res =>
    res.url().includes('/api/v1/reviews/coworking/') &&
    res.request().method() === 'GET'
  );

  await page.waitForTimeout(1000);

});
