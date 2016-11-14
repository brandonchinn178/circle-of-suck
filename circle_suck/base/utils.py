import networkx as nx

def merge_dicts(*dicts):
    """
    Merge an arbitrary amount of dictionaries together.

    If multiple keys exist, will replace with the key in the last dictionary

    >>> a = { 'a': 1 }
    >>> b = { 'b': 2 }
    >>> c = { 'c': 3 }
    >>> merge_dicts(a, b, c)
    { 'a': 1, 'b': 2, 'c': 3 }
    """
    return dict(sum([list(d.items()) for d in dicts], []))

def flatten(l):
    """
    Flatten a list of lists

    >>> x = [[1,2,3], [4,5]]
    >>> flatten(x)
    [1,2,3,4,5]
    """
    return [x for sublist in l for x in sublist]

def find_cycles(graph, minsize=3):
    """
	Takes in a graph in the format: {u: [v1, v2, ...], ...}, where (u, v1), (u, v2),
    etc are directed edges in a graph.

	Returns a list of all disjoint cycles in the given graph
    Source: http://stackoverflow.com/a/34532442/4966649

    >>> testgraph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[6,9],9:[]})
    >>> find_cycles(testgraph)
    [[8, 6, 7]]
	"""
    G = nx.DiGraph()
    G.add_nodes_from(graph.keys())
    all_edges = []
    for node1, nodes in graph.items():
        all_edges.extend([(node1, node2) for node2 in nodes])
    G.add_edges_from(all_edges)
    all_cycles = []

    while len(G.nodes()) > 0:
        cycles = list(nx.simple_cycles(G))
        if len(cycles) == 0:
            break
        longest_cycle = max(cycles, key=lambda c: len(c))
        if len(longest_cycle) < minsize:
            break
        else:
            all_cycles.append(longest_cycle)
            G.remove_nodes_from(longest_cycle)

    return all_cycles
