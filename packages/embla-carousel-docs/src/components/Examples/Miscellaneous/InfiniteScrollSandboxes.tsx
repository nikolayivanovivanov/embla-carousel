import React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { SANDBOX_VANILLA_FOLDERS } from 'components/CodeSandbox/Vanilla/sandboxVanillaFolders'
import CarouselInfiniteScroll from 'components/CodeSandbox/React/SandboxFilesSrc/InfiniteScroll/EmblaCarousel'
import { createSandboxVanilla } from 'components/CodeSandbox/Vanilla/createSandboxVanilla'
import { createSandboxReact } from 'components/CodeSandbox/React/createSandboxReact'
import { createSandboxFunctionsWithLabels } from 'components/CodeSandbox/createSandboxFunctionsWithLabels'
import { loadPrettier } from 'utils/loadPrettier'
import {
  ID,
  SLIDES,
  OPTIONS,
  STYLES,
} from 'components/Examples/Miscellaneous/InfiniteScroll'
import {
  SelectCodeSandbox,
  PropType as SelectCodeSandboxPropType,
} from 'components/CodeSandbox/SelectCodeSandbox'

const SHARED_CONFIG = {
  slides: SLIDES,
  options: OPTIONS,
  styles: STYLES,
  id: ID,
}

const VANILLA_INFINITE_SCROLL_FILE_NAME = 'infinite-scroll'

const sandboxVanillaJavaScript = async (): Promise<string> => {
  const { formatJs } = await loadPrettier()
  const [carousel, infiniteScroll] = await Promise.all([
    import(
      '!!raw-loader!components/CodeSandbox/Vanilla/SandboxFilesDist/InfiniteScroll/EmblaCarousel.js'
    ),
    import(
      `!!raw-loader!components/CodeSandbox/Vanilla/SandboxFilesDist/InfiniteScroll/infinite-scroll.js`
    ),
  ])

  return createSandboxVanilla({
    ...SHARED_CONFIG,
    carouselScript: carousel.default,
    carouselHtml: ReactDOMServer.renderToStaticMarkup(
      <CarouselInfiniteScroll options={OPTIONS} slides={SLIDES} />,
    ),
    language: 'javascript',
    sandboxOverrides: {
      [`${SANDBOX_VANILLA_FOLDERS.JS}/${VANILLA_INFINITE_SCROLL_FILE_NAME}.js`]:
        {
          isBinary: false,
          content: formatJs(infiniteScroll.default),
        },
    },
  })
}

const sandboxVanillaTypeScript = async (): Promise<string> => {
  const { formatTs } = await loadPrettier()
  const [carousel, infiniteScroll] = await Promise.all([
    import(
      '!!raw-loader!components/CodeSandbox/Vanilla/SandboxFilesDist/InfiniteScroll/EmblaCarousel.ts'
    ),
    import(
      `!!raw-loader!components/CodeSandbox/Vanilla/SandboxFilesDist/InfiniteScroll/infinite-scroll.ts`
    ),
  ])
  return createSandboxVanilla({
    ...SHARED_CONFIG,
    carouselScript: carousel.default,
    carouselHtml: ReactDOMServer.renderToStaticMarkup(
      <CarouselInfiniteScroll options={OPTIONS} slides={SLIDES} />,
    ),
    language: 'typescript',
    sandboxOverrides: {
      [`${SANDBOX_VANILLA_FOLDERS.JS}/${VANILLA_INFINITE_SCROLL_FILE_NAME}.ts`]:
        {
          isBinary: false,
          content: formatTs(infiniteScroll.default),
        },
    },
  })
}

const sandboxReactJavaScript = async (): Promise<string> => {
  const carousel = await import(
    `!!raw-loader!components/CodeSandbox/React/SandboxFilesDist/InfiniteScroll/EmblaCarousel.jsx`
  )
  return createSandboxReact({
    ...SHARED_CONFIG,
    carouselScript: carousel.default,
    language: 'javascript',
  })
}

const sandboxReactTypeScript = async (): Promise<string> => {
  const carousel = await import(
    `!!raw-loader!components/CodeSandbox/React/SandboxFilesDist/InfiniteScroll/EmblaCarousel.tsx`
  )
  return createSandboxReact({
    ...SHARED_CONFIG,
    carouselScript: carousel.default,
    language: 'typescript',
  })
}

const SANDBOXES: SelectCodeSandboxPropType['sandboxes'] =
  createSandboxFunctionsWithLabels({
    VANILLA_JS: sandboxVanillaJavaScript,
    VANILLA_TS: sandboxVanillaTypeScript,
    REACT_JS: sandboxReactJavaScript,
    REACT_TS: sandboxReactTypeScript,
  })

export const ExampleCarouselInfiniteScrollSandboxes = () => {
  return <SelectCodeSandbox sandboxes={SANDBOXES} />
}
