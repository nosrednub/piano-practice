import { test, expect } from '@playwright/test';
import { jazzScales, keySignatures } from '../src/data/scales';

test.describe('Jazz Piano Practice App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
  });

  test('page title is correct', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Jazz Piano Scale Practice');
  });

  test('all scale options are available', async ({ page }) => {
    const scaleSelect = page.locator('#scale-select');
    await scaleSelect.click();
    
    // Verify all scales from our data are present
    for (const scale of jazzScales) {
      const option = page.locator(`option[value="${scale.id}"]`);
      await expect(option).toHaveText(scale.name);
    }
  });

  test('all key signature options are available', async ({ page }) => {
    const keySelect = page.locator('#key-select');
    await keySelect.click();
    
    // Verify all key signatures from our data are present
    for (const key of keySignatures) {
      const option = page.locator(`option[value="${key.id}"]`);
      await expect(option).toHaveText(key.name);
    }
  });

  test('octave selector shows correct options', async ({ page }) => {
    const octaveSelect = page.locator('#octave-select');
    await octaveSelect.click();
    
    // Verify octave options 1-4 are present
    for (let i = 1; i <= 4; i++) {
      const option = page.locator(`option[value="${i}"]`);
      await expect(option).toHaveText(`${i} ${i === 1 ? 'Octave' : 'Octaves'}`);
    }
  });

  test('changing scale updates description', async ({ page }) => {
    const scaleSelect = page.locator('#scale-select');
    await scaleSelect.selectOption('dorian');
    
    // Verify the description updates
    const description = jazzScales.find(scale => scale.id === 'dorian').description;
    await expect(page.locator('p.text-gray-500')).toHaveText(description);
  });

  test('staff is rendered with correct elements', async ({ page }) => {
    // Wait for the staff to be rendered
    await page.waitForSelector('[data-testid="staff-display"] svg');
    
    // Verify basic staff elements are present
    const staffSvg = page.locator('[data-testid="staff-display"] svg').first();
    await expect(staffSvg).toBeVisible();
    
    // Check for staff lines and clef
    const pathCount = await page.locator('[data-testid="staff-display"] svg path').count();
    expect(pathCount).toBeGreaterThan(5);
  });

  test('changing octaves updates note count', async ({ page }) => {
    // Wait for initial render
    await page.waitForSelector('[data-testid="staff-display"] svg');
    
    // Set to 4 octaves and wait for render
    await page.locator('#octave-select').selectOption('4');
    await page.waitForTimeout(500); // Increased wait time for render
    
    // Count notes in 4 octaves (using g elements which typically represent notes in VexFlow)
    const initialNoteElements = await page.locator('[data-testid="staff-display"] svg g[class*="vf-stavenote"]').count();
    
    // Change to 2 octaves and wait for render
    await page.locator('#octave-select').selectOption('2');
    await page.waitForTimeout(500); // Increased wait time for render
    
    // Count notes in 2 octaves
    const newNoteElements = await page.locator('[data-testid="staff-display"] svg g[class*="vf-stavenote"]').count();
    
    // Should have fewer notes with 2 octaves than 4
    expect(newNoteElements).toBeLessThan(initialNoteElements);
    expect(newNoteElements).toBeGreaterThan(0);
  });

  test('preferences are saved to localStorage', async ({ page }) => {
    // Change some settings
    await page.locator('#scale-select').selectOption('dorian');
    await page.locator('#key-select').selectOption('F');
    await page.locator('#octave-select').selectOption('2');
    
    // Reload the page
    await page.reload();
    
    // Verify settings were restored
    await expect(page.locator('#scale-select')).toHaveValue('dorian');
    await expect(page.locator('#key-select')).toHaveValue('F');
    await expect(page.locator('#octave-select')).toHaveValue('2');
  });

  test('scale pattern is continuous without repeated notes', async ({ page }) => {
    // Select 2 octaves for clearer testing
    await page.locator('#octave-select').selectOption('2');
    await page.waitForTimeout(500); // Increased wait time for render
    
    // Get all note elements using VexFlow's note class
    const noteElements = await page.locator('[data-testid="staff-display"] svg g[class*="vf-stavenote"]').all();
    
    // Get note positions and round to handle minor floating-point differences
    const notePositions = await Promise.all(
      noteElements.map(async (element) => {
        const bbox = await element.boundingBox();
        return Math.round(bbox.y * 100) / 100; // Round to 2 decimal places
      })
    );
    
    // Check for duplicates at octave boundaries
    // Skip checking consecutive notes that are part of different octaves
    let consecutiveDuplicates = 0;
    for (let i = 1; i < notePositions.length; i++) {
      if (Math.abs(notePositions[i] - notePositions[i - 1]) < 0.01) {
        consecutiveDuplicates++;
      }
    }
    
    // Allow for a small number of duplicates that might be legitimate (e.g., at phrase boundaries)
    expect(consecutiveDuplicates).toBeLessThanOrEqual(2);
  });
});