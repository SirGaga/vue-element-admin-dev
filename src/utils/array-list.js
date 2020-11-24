export function listConvertTree(list) {
  let root = null
  if (list && list.length) {
    root = { id: 0, parentId: null, children: [] }
    const group = {}
    for (const listElement of list) {
      if (listElement.parentId !== null && listElement.parentId !== undefined) {
        if (!group[listElement.parentId]) {
          group[listElement.parentId] = []
        }
        group[listElement.parentId].push(listElement)
      }
    }
    const queue = []
    queue.push(root)
    while (queue.length) {
      const node = queue.shift()
      node.children = group[node.id] && group[node.id].length ? group[node.id] : null
      if (node.children) {
        queue.push(...node.children)
      }
    }
  }
  return root
}

export function treeConvertList(root) {
  const list = []
  if (root) {
    const Root = JSON.parse(JSON.stringify(root))
    const queue = []
    queue.push(Root)
    while (queue.length) {
      const node = queue.shift()
      if (node.children && node.children.length) {
        queue.push(...node.children)
      }
      delete node.children
      if (node.parentId !== null && node.parentId !== undefined) {
        list.push(node)
      }
    }
  }
  return list
}
