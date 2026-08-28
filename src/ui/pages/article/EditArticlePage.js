import { expect, testStep } from '../../../common/pwHelpers/pw';

export class EditArticlePage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.articleTitleHeader = page.getByRole('heading');
    this.tagField = page.getByPlaceholder('Enter tags');
    this.publishButton = page.getByRole('button', { name: 'Update Article' });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  tagPill(tagName) {
    return this.page.locator('.tag-pill', { hasText: tagName });
  }

  async fillTagsField(tags) {
    await this.step(`Fill the 'Tags' field`, async () => {
      for (const tag of tags) {
        await this.tagField.fill(tag);
        await this.page.keyboard.press('Enter');
      }
    });
  }

  async removeTag(tagName) {
    await this.step(`Remove the '${tagName}' tag`, async () => {
      await this.tagPill(tagName).locator('i.ion-close-round').click();
    });
  }

   async removeAllTags() {
    await this.step(`Remove all tags`, async () => {
      const tagPills = this.page.locator('.tag-pill');

      while ((await tagPills.count()) > 0) {
        await tagPills.first().locator('i.ion-close-round').click();
      }
    });
  
  }

    async clickPublishButton() {
    await this.step(`Click the 'Update Article' button`, async () => {
      await this.publishButton.click();
      await this.page.waitForURL(/\/article\//);
      await this.page.reload();
    });
  
  }

  async assertArticleTitle(title) {
    await this.step(`Assert the article has correct title'`, async () => {
      await expect(this.articleTitleHeader).toContainText(title);
    });
  }

  async assertArticleText(text) {
    await this.step(`Assert the article has correct text'`, async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
  }
}