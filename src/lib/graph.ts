import jsgraphs from 'js-graph-algorithms'
import _ from 'lodash'

/**
 * Get the hamiltonian path of the given graph, if one exists.
 */
export const getHamiltonian = (graph: jsgraphs.DiGraph): number[] | null => {
  const cc = new jsgraphs.StronglyConnectedComponents(graph)

  if (cc.componentCount() !== 1 || !_.every(_.range(graph.V), (v) => cc.componentId(v) === 0)) {
    return null
  }

  return new jsgraphs.TopologicalSort(graph).order()
}

/**
 * Get the longest path in the given graph.
 */
export const getLongestPath = (graph: jsgraphs.DiGraph): number[] => {
  const longestPathFrom = (
    curr: number,
    seen: number[], // has 'curr' already
  ): number[] => {
    const neighborPaths = _.compact(_.map(graph.adj(curr), (neighbor) => {
      if (_.includes(seen, neighbor)) {
        return null
      }

      return longestPathFrom(neighbor, _.concat(seen, neighbor))
    }))

    return _.concat([curr], getLongest(neighborPaths))
  }

  const vertexPaths = _.map(_.range(graph.V), (vertex) => longestPathFrom(vertex, [vertex]))
  return getLongest(vertexPaths)
}

// Get longest list in the given list of lists. Returns empty list if an empty list is provided.
const getLongest = <T>(list: T[][]): T[] => _.orderBy(list, [_.size], ['desc'])[0] || []
