import _ from 'lodash'

export class WeightedDiGraph {
  size: number
  adjMatrix: (number | null)[][]

  constructor(size: number) {
    this.size = size
    this.adjMatrix = _.map(Array(size), () => _.fill(Array(size), null))
  }

  addEdge(n1: number, n2: number, weight: number) {
    if (n1 >= this.size || n2 >= this.size) {
      throw new Error('Vertex does not exist')
    }
    this.adjMatrix[n1][n2] = weight
  }

  allFrom(n: number): { weight: number; neighbor: number }[] {
    if (n >= this.size) {
      throw new Error('Vertex does not exist')
    }
    return _.compact(this.adjMatrix[n].map((weight, neighbor) =>
      weight === null ? null : { weight, neighbor }
    ))
  }
}

type Path = {
  nodes: number[]
  weight: number
}

/**
 * Get the shortest hamiltonian path of the given graph.
 */
export const getHamiltonian = (graph: WeightedDiGraph): number[] | null => {
  const START_NODE = 0

  const getHamiltonianFrom = (curr: number, currPath: Path): Path[] => {
    return _.flatMap(graph.allFrom(curr), ({ neighbor, weight }) => {
      if (neighbor === START_NODE && currPath.nodes.length === graph.size) {
        return [currPath]
      }

      if (_.includes(currPath.nodes, neighbor)) {
        return []
      }

      return getHamiltonianFrom(neighbor, {
        nodes: _.concat(currPath.nodes, neighbor),
        weight: currPath.weight + weight,
      })
    })
  }

  const paths = getHamiltonianFrom(START_NODE, { nodes: [START_NODE], weight: 0 })
  const shortestPath = _.minBy(paths, 'weight')
  if (!shortestPath) {
    return null
  }
  return shortestPath.nodes
}
