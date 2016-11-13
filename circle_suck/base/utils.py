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

    >>> testgraph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[6,9],9:[]})
    >>> find_cycles(testgraph)
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

    return sorted(listoflists, key=lambda l: -len(l))

def find_longest_cycle(graph):
    cycles = []
    items_left = len(graph)
    max_cycle_len = 0
    for item, value in graph.items():
        new_cycles = find_all_cycles(graph, item)
        for c in new_cycles:
            if len(c) > max_cycle_len:
                max_cycle_len = len(c)
        cycles += new_cycles
        items_left -= 1

        #Once we have a cycle larger than the amount of elements 
        #we are yet to try starting the algorithm at, we must 
        #have the longest cycle in the graph. Any newly discovered
        #cycles would only exist in the elements not yet checked,
        #and we already know there are fewer of those than there
        #are elements in our longest cycle so far.
        if max_cycle_len > items_left:
            break
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
