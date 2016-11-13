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
