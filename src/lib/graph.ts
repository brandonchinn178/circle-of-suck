import _ from 'lodash'

// A directed graph represented as a mapping from a vertex to its connected
// vertices.
type DirectedGraph = {
  [vertex: string]: string[]
}

/**
 * Get the longest path in the given graph, ending up with a hamiltonian path
 * in the best case scenario.
 */
export const getLongestPath = (graph: DirectedGraph): string[] => {
  const longestPathFrom = (
    curr: string,
    seen: string[], // has 'curr' already
  ): string[] => {
    const neighborPaths = _.compact(_.map(graph[curr], (neighbor) => {
      if (_.includes(seen, neighbor)) {
        return null
      }

      return longestPathFrom(neighbor, _.concat(seen, neighbor))
    }))

    return _.concat([curr], getLongest(neighborPaths))
  }

  const vertexPaths = _.map(_.keys(graph), (vertex) => longestPathFrom(vertex, [vertex]))
  return getLongest(vertexPaths)
}

// Get longest list in the given list of lists. Returns empty list if an empty list is provided.
const getLongest = <T>(list: T[][]): T[] => _.orderBy(list, [_.size], ['desc'])[0] || []
