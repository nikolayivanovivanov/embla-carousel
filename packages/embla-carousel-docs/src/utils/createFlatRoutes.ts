import { MdxAllRoutesType, RouteType } from 'components/Routes/RoutesContext'

export const createFlatRoutes = (data: MdxAllRoutesType): RouteType[] => {
  return data.allMdx.edges
    .map(({ node }) => node)
    .map(({ id, fields, frontmatter }) => ({
      id,
      slug: fields.slug,
      title: frontmatter.title,
      order: frontmatter.order || 0,
      description: frontmatter.description,
      level: fields.slug.split('/').filter(Boolean).length,
      children: [],
    }))
}
