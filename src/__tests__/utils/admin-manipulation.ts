import { Page } from 'puppeteer';

export const isOptionsPanelOpen = async (page: Page) => {
	return await page.evaluate(
		() =>
			document.querySelector('.interface-more-menu-dropdown__content') !=
			null
	);
};

export const setOptionsPanel = async (page: Page, activate: boolean) => {
	if ((await isOptionsPanelOpen(page)) === activate) {
		return;
	}
	await page.waitForSelector(
		'.editor-header__settings .components-button.components-dropdown-menu__toggle:not(.editor-preview-dropdown__toggle), .edit-post-header__settings .components-button.components-dropdown-menu__toggle:not(.editor-preview-dropdown__toggle)',
		{ timeout: 1000 }
	);
	await page.click(
		'.editor-header__settings .components-button.components-dropdown-menu__toggle:not(.editor-preview-dropdown__toggle), .edit-post-header__settings .components-button.components-dropdown-menu__toggle:not(.editor-preview-dropdown__toggle)'
	);
};

/**
 * Activates or deactivates the Gutenberg Code Editor
 * @param page
 * @param activate
 */
export const setCodeEditor = async (page: Page, activate: boolean) => {
	// 250ms timeout
	await new Promise((resolve) => setTimeout(resolve, 250));
	// Code Editor is on if we can find the editor toolbar ("exit code editor")
	let isOn = await page.evaluate(
		() =>
			document.querySelector(
				'.editor-text-editor__toolbar, .edit-post-text-editor__toolbar'
			) != null
	);
	if (isOn && !activate) {
		// click on the editor toolbar
		await page.click(
			'.editor-text-editor__toolbar button, .edit-post-text-editor__toolbar button',
			{
				delay: 100,
			}
		);
	} else if (!isOn && activate) {
		await setOptionsPanel(page, true);
		// Find the option command that says "Code Editor" using XPATH
		// Unfortunately, Cmd+Alt+Shift+M is not working
		await page.evaluate(() => {
			let label = document
				.querySelectorAll(
					'.components-dropdown-menu__menu button>span.components-menu-item__item'
				)
				.values()
				.find(
					(item) => (item as HTMLElement).innerText == 'Code editor'
				);
			if (label) {
				// click on the parent button
				label.parentElement?.click();
			}
		});
	}
};

export const isRightPanelOpen = async (page: Page) => {
	return await page.evaluate(
		() => document.querySelector('div#edit-post\\:document') != null
	);
};
export const setRightPanel = async (page: Page, activate: boolean) => {
	if ((await isRightPanelOpen(page)) === activate) {
		return;
	}
	await page
		.waitForSelector(
			'button[aria-label="Settings"][aria-controls="edit-post:document"]',
			{ timeout: 500 }
		)
		.then(async (el) => {
			if (el) {
				await el.click();
			}
		})
		.catch(() => {
			throw new Error('Right panel button not found');
		});
};

export const doLoginIfNeeded = async (
	page: Page,
	username: string,
	password: string
) => {
	// Find out if we need to login (url changed to wp-login.php)
	let url = await page.url();
	if (url.includes('setup-config.php')) {
		// Maybe the user needs to choose a language at first login
		await doChooseLanguageIfNeeded(page);
		// Maybe the user needs to run a database update
		await doRunDatabaseUpdateIfNeeded(page);
		url = await page.url();
	}
	if (url.includes('wp-login.php')) {
		// Find the username input and type the username
		await page.waitForSelector('#user_login', { timeout: 5000 });
		// Needed to avoid race condition
		await new Promise((resolve) => setTimeout(resolve, 250));
		await page.type('#user_login', username);
		// Find the password input and type the password
		await page.waitForSelector('#user_pass', { timeout: 5000 });
		await page.type('#user_pass', password);
		await new Promise((resolve) => setTimeout(resolve, 250));
		// Find the login button and click it
		await page.click('#wp-submit', { delay: 100 });
		// Wait for the page to load
		await page.waitForNavigation({ timeout: 10000 }).catch(async () => {
			if (url.includes('wp-login.php')) {
				// Find the username input and type the username
				await page.waitForSelector('#user_login', { timeout: 5000 });
				// Needed to avoid race condition
				await new Promise((resolve) => setTimeout(resolve, 250));
				await page.type('#user_login', username);
				// Find the password input and type the password
				await page.waitForSelector('#user_pass', { timeout: 5000 });
				await page.type('#user_pass', password);
				await new Promise((resolve) => setTimeout(resolve, 250));
				// Find the login button and click it
				await page.click('#wp-submit', { delay: 100 });
				// Wait for the page to load
				await page.waitForNavigation({ timeout: 10000 });
			}
		});
	}
};

export const doChooseLanguageIfNeeded = async (page: Page) => {
	await page
		.waitForSelector('#language-continue', { timeout: 500 })
		.then(async (el) => {
			if (el) {
				await el.click();
			}
		})
		.catch(() => {
			// No language selector found, so we're good
		});
};
export const doRunDatabaseUpdateIfNeeded = async (page: Page) => {
	let skip = false;
	while (!skip && (await loginPageRequiresStep(page))) {
		await page
			.waitForSelector('.wp-core-ui .step a', { timeout: 500 })
			.then(async (el) => {
				if (el) {
					await el.click();
					// wait for the page to load a bit after clicking
					await new Promise((resolve) => setTimeout(resolve, 1000));
				}
			})
			.catch(() => {
				// something happened, let's say we're done
				skip = true;
			});
	}
};
async function loginPageRequiresStep(page: Page) {
	return await page.evaluate(
		() => {
			return document.querySelector('.wp-core-ui .step') != null;
		},
		{ timeout: 500 }
	);
}

export async function discardTutorialIfNeeded(page: Page) {
	await page
		.waitForSelector('.components-guide .components-modal__header button', {
			timeout: 500,
		})
		.then(async (el) => {
			if (el) {
				await el.click();
			}
		})
		.catch(() => {
			// No tutorial found, so we're good
		});
}

/**
 * Builds the HTML <--wp:--> of a Worpress block from its arguments
 * TODO: Handle children and content
 * @returns HTML to write in Gutenberg Code Editor
 */
export const writeBlockHTML = (blockSlug: string, blockArgs: any) => {
	let content = (blockArgs as any).content ?? null;
	let children = (blockArgs as any).children ?? null;
	let args = { ...blockArgs, children: undefined, content: undefined };
	let html = '';

	if (content) {
		html += `<!-- wp:${blockSlug} ${JSON.stringify(args)} -->\n`;
		html += content;
		html += `\n<!-- /wp:${blockSlug} -->\n`;
	} else if (children && Array.isArray(children) && children.length > 0) {
		html += `<!-- wp:${blockSlug} ${JSON.stringify(args)} -->\n`;
		for (const child of children) {
			html += writeBlockHTML(child.blockName, child.attributes);
		}
		html += `\n<!-- /wp:${blockSlug} -->\n`;
		// } else if (children && children instanceof HTMLElement) {
		// 	allComponentsHTML += `<!-- wp:${blockSlug} ${JSON.stringify(args)} -->\n`;
		// 	allComponentsHTML += children.outerHTML;
		// 	allComponentsHTML += `\n<!-- /wp:${blockSlug} -->\n`;
	} else {
		html += `<!-- wp:${blockSlug} ${JSON.stringify(args)} /-->\n`;
	}
	return html;
};
