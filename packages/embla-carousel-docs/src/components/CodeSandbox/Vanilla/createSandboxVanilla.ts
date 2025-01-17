import { getParameters } from 'codesandbox/lib/api/define'
import { BASE_CSS, SANDBOX_CSS } from '../sandboxStyles'
import { SANDBOX_VANILLA_FOLDERS } from './sandboxVanillaFolders'
import { createSandboxImages } from '../sandboxImages'
import { loadPrettier } from 'utils/loadPrettier'
import { createSandboxVanillaPackageJson } from './createSandboxVanillaPackageJson'
import { createSandboxVanillaTsConfig } from './createSandboxVanillaTsConfig'
import { createSandboxVanillaTsDeclarations } from './createSandboxVanillaTsDeclarations'
import { createSandboxVanillaEntry } from './createSandboxVanillaEntry'
import { createSandboxVanillaImagePaths } from './createSandboxVanillaImagePaths'
import { createSandboxVanillaOptions } from './createSandboxVanillaOptions'
import { SandboxVanillaCreateType, SandboxConfigType } from '../sandboxTypes'
import {
  languageToVanillaExtension,
  isLanguageTypeScript,
} from '../sandboxUtils'

export const createSandboxVanilla = async (
  config: SandboxVanillaCreateType,
): Promise<string> => {
  const {
    id,
    carouselScript,
    carouselHtml,
    options,
    styles,
    plugins,
    sandboxOverrides,
    language = 'javascript',
  } = config
  const title = `${id}-vanilla`
  const sandboxImages = createSandboxImages(SANDBOX_VANILLA_FOLDERS.IMAGES)
  const { prettierConfig, formatHtml, formatCss, formatJs, formatTs } =
    await loadPrettier()
  const scriptExtension = languageToVanillaExtension(language)
  const isTypeScript = isLanguageTypeScript(language)
  const formatScript = isTypeScript ? formatTs : formatJs
  const packageJson = createSandboxVanillaPackageJson(language, title, plugins)
  const tsConfig = createSandboxVanillaTsConfig()
  const entryScript = createSandboxVanillaOptions(carouselScript, options)
  const [entryHtml, tsDeclarations] = await Promise.all([
    createSandboxVanillaEntry(
      title,
      scriptExtension,
      createSandboxVanillaImagePaths(carouselHtml),
    ),
    createSandboxVanillaTsDeclarations(),
  ])

  const sandboxConfig: SandboxConfigType['files'] = {
    [`.prettierrc`]: {
      isBinary: false,
      content: JSON.stringify(prettierConfig, null, '\t'),
    },
    [`package.json`]: {
      isBinary: false,
      content: JSON.stringify(packageJson, null, '\t'),
    },
    [`index.html`]: {
      isBinary: false,
      content: formatHtml(entryHtml),
    },
    [`${SANDBOX_VANILLA_FOLDERS.CSS}/base.css`]: {
      isBinary: false,
      content: formatCss(BASE_CSS),
    },
    [`${SANDBOX_VANILLA_FOLDERS.CSS}/sandbox.css`]: {
      isBinary: false,
      content: formatCss(SANDBOX_CSS),
    },
    [`${SANDBOX_VANILLA_FOLDERS.CSS}/embla.css`]: {
      isBinary: false,
      content: formatCss(styles),
    },
    [`${SANDBOX_VANILLA_FOLDERS.JS}/index.${scriptExtension}`]: {
      isBinary: false,
      content: formatScript(entryScript),
    },
  }

  if (isTypeScript) {
    Object.assign(sandboxConfig, {
      [`tsconfig.json`]: {
        isBinary: false,
        content: JSON.stringify(tsConfig, null, '\t'),
      },
      [`declarations.d.ts`]: {
        isBinary: false,
        content: tsDeclarations,
      },
    })
  }

  return getParameters({
    files: Object.assign({}, sandboxConfig, sandboxImages, sandboxOverrides),
  })
}
