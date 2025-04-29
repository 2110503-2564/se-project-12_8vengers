import { test, expect } from '@playwright/test';
test.setTimeout(50000);
test('User1 Rate4', async ({ page }) => {
  await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
  await page.fill('input[name="email"]', 'Cat@gmail.com');
  await page.fill('input[name="password"]', '12345678');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });

  await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();

  const forthItem = page.locator('a[href^="/coworkingspace/"]').nth(4);
  await forthItem.click();

  
  await page.locator('label[for=":r4:"]').click();
  await expect(page.locator('text=Rating submitted!')).toBeVisible();
  await page.waitForTimeout(1000);
});

test('User2 Rate5', async ({ page }) => {
    await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
    await page.fill('input[name="email"]', 'Dog@gmail.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });

    await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();

    const forthItem = page.locator('a[href^="/coworkingspace/"]').nth(4);
    await forthItem.click();

    await expect(page.locator('text=Average Rating')).toBeVisible();
  
    await page.locator('label[for=":r5:"]').click();
    await expect(page.locator('text=Rating submitted!')).toBeVisible();
    await page.waitForTimeout(1000);
  });

  test('User1 ChangeRate to 3', async ({ page }) => {
    await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
    await page.fill('input[name="email"]', 'Cat@gmail.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });

    await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();

    const forthItem = page.locator('a[href^="/coworkingspace/"]').nth(4);
    await forthItem.click();
    
    await expect(page.locator('text=Average Rating')).toBeVisible();

    await page.locator('label[for=":r3:"]').click();
    await expect(page.locator('text=Rating submitted!')).toBeVisible();
    await page.waitForTimeout(1000);
  });
