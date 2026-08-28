/* eslint-disable max-len */
import { expect, testStep } from '../../common/pwHelpers/pw';

export class ProfilePage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.followButton = page.getByRole('button', { name: /follow/i });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async open(username) {
    await this.step(`Open profile page`, async () => {
      await this.page.goto(`/profile/${encodeURIComponent(username.toLowerCase())}`);
    });
  }

  async clickFollowButton() {
    await this.step(`Click the 'Follow' button on profile`, async () => {
      await this.followButton.click();
    });
  }

  async assertFollowButtonHasText(text) {
    await this.step(`Assert the follow button shows '${text}'`, async () => {
      await expect(this.followButton).toContainText(text, { timeout: 10000 });
    });
  }
}