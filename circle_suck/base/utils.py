from tarjan import *

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
    return dict(sum([d.items() for d in dicts], []))

def find_all_connected(graph, minsize=2):
	"""
	Takes in a graph in the format: {footballteam1:[footballteam1 beat these footballteams]...}
	Ex: {Cal:[Utah, Oregon]...}
	
	Returns a list of all disjoint cycles in the given graph (not sorted by length)
	"""
    listoflists = []
    list = tarjan(graph)
    for item in list[:]:
        if len(item) <= minsize:
            list.remove(item)
    #print(list)
    for con_comp in list:
        newgraph = {}
        for vertex, to in graph.items():
            if vertex in con_comp:
                newgraph[vertex] = to
        listoflists.append(find_longest_cycle(newgraph))
    return listoflists

def find_all_cycles(graph, start):
    def find_all_paths(graph, start, end, path=[]):
        path = path + [start]
        if start == end:
            return [path]
        if not start in graph.keys():
            return []
        paths = []
        for node in graph[start]:
            if node not in path:
                newpaths = find_all_paths(graph, node, end, path)
                for newpath in newpaths:
                    paths.append(newpath)
        return paths

    starting = start
    endingindexes = []
    for k, v in graph.items():
        if starting in v:
            endingindexes.append(k)

    all_paths = []
    for endindex in endingindexes:
        all_paths += find_all_paths(graph, starting, endindex)
    return all_paths

def find_longest_cycle(graph):
    cycles = []
    for item, value in graph.items():
        cycles += find_all_cycles(graph, item)
    #print(cycles)
    return max(cycles, key = lambda x: len(x))
