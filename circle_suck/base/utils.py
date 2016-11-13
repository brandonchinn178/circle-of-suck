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

def find_all_connected(graph, minsize=3):
    """
	Takes in a graph in the format: {footballteam1:[footballteam1 beat these footballteams]...}
	Ex: {Cal:[Utah, Oregon]...}
	Returns a list of all disjoint cycles in the given graph (not sorted by length)

    >>> testgraph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[6,9],9:[]})
    >>> find_all_connected(testgraph)
    [[8, 6, 7]]
	"""
    listoflists = []

    #Use tarjan algorithm to divide into fully connected components
    newlist = tarjan(graph)

    #get rid of all connected components with fewer than minsize elements
    for item in newlist[:]:
        if len(item) < minsize:
            newlist.remove(item)

    #find all cycles in each fully connected component
    while newlist:
        con_comp = newlist[0]
        newlist.remove(newlist[0])
        #create graph of this connected component only
        newgraph = {}
        for vertex, outflow in graph.items():
            if vertex in con_comp:
                newgraph[vertex] = outflow
        #find cycles in this smaller graph
        longest_cycle = find_longest_cycle(newgraph)
        listoflists.append(longest_cycle)

        #remove cycle from graph
        temp_dict = {};
        for elem in con_comp:
            if elem not in longest_cycle:
                temp_dict[elem] = newgraph[elem]
        newgraph = temp_dict

        #re-apply tarjan with smaller graph
        subgraphs = tarjan(newgraph)

        #remove all connected components with fewer than minsize elements, and rerun algorithm on the rest
        for subgraph in subgraphs:
            if len(subgraph) < minsize:
                subgraphs.remove(subgraph)
            else:
                newlist.append(subgraph)
    return listoflists

def find_longest_cycle(graph):
    cycles = []
    for item, value in graph.items():
        cycles += find_all_cycles(graph, item)
    return max(cycles, key = lambda x: len(x))

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

    endingindexes = [k for k, v in graph.items() if start in v]

    all_paths = []
    for endindex in endingindexes:
        all_paths += find_all_paths(graph, start, endindex)
    return all_paths

def same_cycle(cycle1, cycle2):
    """
    checks if 2 cycles are the actually the same
    :param cycle1:
    :param cycle2:
    :return true or false:

    >>> cycle1 = [1, 2, 3]
    >>> cycle2 = [2, 3, 1]
    >>> same_cycle(cycle1, cycle2)
    True
    """
    offset = 0
    if len(cycle1) != len(cycle2):
        return False
    if cycle1 and cycle2:
        for c in cycle2:
            if c == cycle1[0]:
                break
            offset += 1
    for i in range(len(cycle1)):
        if cycle1[i] != cycle2[(i + offset) % len(cycle2)]:
            return False
    return True

