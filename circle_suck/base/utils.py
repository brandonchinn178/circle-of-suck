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
