'use client'

import dynamic from 'next/dynamic'

const toolMap = {
  'qr-generator':            dynamic(() => import('@/components/tools/QrGenerator')),
  'password-gen':            dynamic(() => import('@/components/tools/PasswordGen')),
  'unit-converter':          dynamic(() => import('@/components/tools/UnitConverter')),
  'youtube-thumbnail':       dynamic(() => import('@/components/tools/YoutubeThumbnail')),
  'image-compressor':        dynamic(() => import('@/components/tools/ImageCompressor')),
  'image-to-text':           dynamic(() => import('@/components/tools/ImageToText')),
  'signature-maker':         dynamic(() => import('@/components/tools/SignatureMaker')),
  'heic-to-jpg':             dynamic(() => import('@/components/tools/HeicToJpg')),
  'text-to-pdf':             dynamic(() => import('@/components/tools/TextToPdf')),
  'image-converter':         dynamic(() => import('@/components/tools/ImageConverter')),
  'image-resizer':           dynamic(() => import('@/components/tools/ImageResizer')),
  'image-cropper':           dynamic(() => import('@/components/tools/ImageCropper')),
  'word-counter':            dynamic(() => import('@/components/tools/WordCounter')),
  'case-converter':          dynamic(() => import('@/components/tools/CaseConverter')),
  'base64-tool':             dynamic(() => import('@/components/tools/Base64Tool')),
  'json-formatter':          dynamic(() => import('@/components/tools/JsonFormatter')),
  'lorem-ipsum':             dynamic(() => import('@/components/tools/LoremIpsum')),
  'color-picker':            dynamic(() => import('@/components/tools/ColorPicker')),

  'add-watermark':           dynamic(() => import('@/components/tools/AddWatermark')),
  'rotate-flip-image':       dynamic(() => import('@/components/tools/RotateFlipImage')),
  'metatag-generator':       dynamic(() => import('@/components/tools/MetaTagGenerator')),
  'text-to-speech':          dynamic(() => import('@/components/tools/TextToSpeech')),
  'text-to-slug':            dynamic(() => import('@/components/tools/TextToSlug')),
  'whatsapp-link-generator': dynamic(() => import('@/components/tools/WhatsAppLinkGenerator')),
  'favicon-generator':       dynamic(() => import('@/components/tools/FaviconGenerator')),
  'regex-tester':            dynamic(() => import('@/components/tools/RegexTester')),
  'og-preview-checker':      dynamic(() => import('@/components/tools/OgPreviewChecker')),
  'png-to-ico':              dynamic(() => import('@/components/tools/PngToIco')),


}

export default function ToolLoader({ tool, seo }) {
  const Component = toolMap[tool]
  if (!Component) return null
  return <Component seo={seo} />
}