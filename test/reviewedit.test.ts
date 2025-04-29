import { test, expect } from '@playwright/test';
test.setTimeout(50000);
test('Update review text', async ({ page }) => {
  await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
  await page.fill('input[name="email"]', 'SL@gmail.com');
  await page.fill('input[name="password"]', '12345678');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });

  await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();

  const firstItem = page.locator('a[href^="/coworkingspace/"]').first();
  await firstItem.click();

  await page.getByRole('button', { name: 'Write a Review' }).click();
  
  await expect(page.locator('text=Your Comments')).toBeVisible();

  const firstEditButton = page.locator('text=Edit').first();
  await firstEditButton.click();
  await expect(page.locator('text=Edit Comment')).toBeVisible();


  await page.fill('textarea[name="editcomment"]', 'So nice2!');
  await page.waitForTimeout(1000);


  await page.click('button[name="save"]');

  await expect(page.locator('text=Review updated successfully.')).toBeVisible();

  await expect(page.locator('text=Reviews')).toBeVisible();
  await page.waitForTimeout(1000);
});

test('Empty review text.', async ({ page }) => {
    await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
    await page.fill('input[name="email"]', 'SL@gmail.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });
  
    await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();
  
    const firstItem = page.locator('a[href^="/coworkingspace/"]').first();
    await firstItem.click();
  
    await page.getByRole('button', { name: 'Write a Review' }).click();
    
    await expect(page.locator('text=SUBMIT REVIEW')).toBeVisible();
    await page.waitForTimeout(3000);

    await page.click('button[name="submitcomment"]');
    await page.waitForTimeout(2000);

    await expect(page.locator('text=Please provide a comment.')).toBeVisible();
  
});

test('Click “Edit” but make no changes (No edits and Save).', async ({ page }) => {
    await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
    await page.fill('input[name="email"]', 'SL@gmail.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });
  
    await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();
  
    const firstItem = page.locator('a[href^="/coworkingspace/"]').first();
    await firstItem.click();
  
    await page.getByRole('button', { name: 'Write a Review' }).click();
    
    await expect(page.locator('text=Your Comments')).toBeVisible();
  
    const fristEditButton = page.locator('text=Edit').first();
    await fristEditButton.click();
    await expect(page.locator('text=Edit Comment')).toBeVisible();
  
    await page.click('button[name="save"]');
    await page.waitForTimeout(1000);
  
    await expect(page.locator('text=Review updated successfully.')).toBeVisible();
  
    await expect(page.locator('text=Reviews')).toBeVisible();
    await page.waitForTimeout(1000);
  });