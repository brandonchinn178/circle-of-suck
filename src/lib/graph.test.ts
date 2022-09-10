import _ from 'lodash'

import { WeightedDiGraph, getHamiltonian } from './graph'

const graph = ([string]: TemplateStringsArray) => {
    const [size, ...lines] = string.trim().split('\n')
    const g = new WeightedDiGraph(parseInt(size))
    _.each(lines, (line) => {
        const [n1, n2, weight] = line.trim().split(' ').map((x) => parseInt(x))
        g.addEdge(n1, n2, weight || 0)
    })
    return g
}

describe('getHamiltonian', () => {
  it.each`
    name             | graph    | result
    ${'012'}         | ${graph`
                         3
                         0 1
                         1 2
                         2 0
                       `}       | ${[0, 1, 2]}
    ${'01'}          | ${graph`
                         3
                         0 1
                         1 2
                       `}       | ${null}
    ${'010'}         | ${graph`
                         3
                         0 1
                         1 0
                       `}       | ${null}
    ${'0120 < 0210'} | ${graph`
                         3
                         0 1 0
                         0 2 1
                         1 2 0
                         2 1 1
                         2 0 0
                         1 0 1
                       `}      | ${[0, 1, 2]}
  `('$name', ({ graph, result }) => {
    expect(getHamiltonian(graph)).toStrictEqual(result)
  })
})
