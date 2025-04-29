import { test, expect } from '@playwright/test';
test.setTimeout(50000);
test('Click “Submit Review” button', async ({ page }) => {
  await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
  await page.fill('input[name="email"]', 'SL@gmail.com');
  await page.fill('input[name="password"]', '12345678');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });

  await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();

  await expect(page.locator('text=Select your Co-Working Space')).toBeVisible();

  const firstItem = page.locator('a[href^="/coworkingspace/"]').first();
  await firstItem.click();


  await page.getByRole('button', { name:'Write a Review' }).click();
  
  await expect(page.locator('text=Your Comments')).toBeVisible();

  await page.fill('textarea[name="comment"]', 'So nice!');
  await page.waitForTimeout(1000);


  await page.click('button[name="submitcomment"]');
  await page.waitForTimeout(1000);

  await expect(page.locator('text=Review submitted successfully!')).toBeVisible();

  await expect(page.locator('text=Reviews')).toBeVisible();
  await page.waitForTimeout(1000);
});

test('“Write a Review”button not displayed.', async ({ page }) => {
    await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
    await page.fill('input[name="email"]', 'SL@gmail.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });
  
    await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();

    await expect(page.locator('text=Select your Co-Working Space')).toBeVisible();
  
    const thirdItem = page.locator('a[href^="/coworkingspace/"]').nth(2);
    await thirdItem.click();
    await page.waitForTimeout(3000);

    await expect(page.locator('text=You must reserve before rating or reviewing')).toBeVisible();
    await page.waitForTimeout(500);
  });
  