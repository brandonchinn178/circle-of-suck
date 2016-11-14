from django.test import TestCase

from base.utils import *

class TestCycleFinder(TestCase):
    def assertSameCycle(self, cycle1, cycle2):
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

    def test_cycle_finder(self):
        #base test to find simple cycle (and template for other tests)
        graph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[6,9],9:[]}
        for cycle1, cycle2 in zip(find_cycles(graph), [[8, 6, 7]]):
            self.assertSameCycle(cycle1, cycle2)

        #find a larger cycle rather than the subcycle within it
        graph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[2,6,9],9:[]}
        for cycle1, cycle2 in zip(find_cycles(graph), [[2, 5, 6, 7, 8]]):
            self.assertSameCycle(cycle1, cycle2)

        #find one of two equal-length (but not disjoint) cycles
        graph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[5,8],8:[6,9],9:[]}
        for cycle1, cycle2 in zip(find_cycles(graph), [[8, 6, 7]]):
            self.assertSameCycle(cycle1, cycle2)

        #choose the longer of two conflicting cycles
        graph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[2,3,6,9],9:[]}
        for cycle1, cycle2 in zip(find_cycles(graph), [[3, 4, 5, 6, 7, 8]]):
            self.assertSameCycle(cycle1, cycle2)

        #choose the longest of three cycles which conflict in several parts of the graph
        graph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[2,3,6,9],9:[3]}
        for cycle1, cycle2 in zip(find_cycles(graph), [[3, 4, 5, 6, 7, 8, 9]]):
            self.assertSameCycle(cycle1, cycle2)

        #handle a very complex graph with multiple confusing connections
        graph = {1:[2],2:[1,5],3:[1,4],4:[3,5],5:[6],6:[7],7:[8],8:[2,3,6,9],9:[3]}
        for cycle1, cycle2 in zip(find_cycles(graph), [[1, 2, 5, 6, 7, 8, 9, 3]]):
            self.assertSameCycle(cycle1, cycle2)

        #test with real-life data from 10/30/16. Ensures string compatibility and protects from any unforseen real-world errors
        graph = {"Utah":["UDub","Cal"],"UDub":[],"Wazzu":[],"OSU":["Utah","Wazzu","UDub","Colorado"],"Cal":["OSU","ASU", "U$C"],"Oregon":["UDub", "Wazzu", "Cal","Colorado"],"Arizona":["Utah", "UDub", "U$C", "Stanfurd","UCLA"],"ASU":["Oregon","Colorado","U$C","Wazzu"],"Colorado":["U$C"],"U$C":["Utah","Stanfurd"], "UCLA":["Utah","ASU","Wazzu","Stanfurd"], "Stanfurd":["Colorado","UDub","Wazzu"]}
        for cycle1, cycle2 in zip(find_cycles(graph), [['Oregon', 'Colorado','U$C', 'Utah', 'Cal','ASU']]):
            self.assertSameCycle(cycle1, cycle2)

        #test complete circle of suck
        graph = {"Utah":["UDub","Cal"],"UDub":["Arizona"],"Wazzu":["UDub"],"OSU":["Utah","Wazzu","UDub","Colorado"],"Cal":["OSU","ASU", "U$C"],"Oregon":["UDub", "Wazzu", "Cal","Colorado"],"Arizona":["Utah", "UDub", "U$C", "Stanfurd","UCLA"],"ASU":["Oregon","Colorado","U$C","Wazzu"],"Colorado":["U$C"],"U$C":["Utah","Stanfurd"], "UCLA":["Utah","ASU","Wazzu","Stanfurd"], "Stanfurd":["Colorado","UDub","Wazzu","OSU"]}
        for cycle1, cycle2 in zip(find_cycles(graph), [['Arizona', 'UCLA', 'Utah', 'Cal', 'ASU', 'Oregon', 'Colorado', 'U$C', 'Stanfurd', 'OSU', 'Wazzu', 'UDub']]):
            self.assertSameCycle(cycle1, cycle2)
    
        #graph includes multiple disjoint cycles in the same fully connected component
        graph = {1:[2],2:[3],3:[4],4:[1,5,8],5:[6,7],6:[7],7:[4],8:[9],9:[4,10],10:[8]}
        for cycle1, cycle2 in zip(find_cycles(graph), [[1, 2, 3, 4], [8, 9, 10]]):
            self.assertSameCycle(cycle1, cycle2)

        #graph includes multiple fully connected components with one cycle each. Also tests real-world data.
        graph = {"Utah":["UDub"],"UDub":[],"Wazzu":[],"OSU":["Utah","Wazzu","UDub","Colorado"],"Cal":["OSU","ASU", "U$C"],"Oregon":["UDub", "Wazzu", "Cal","Colorado"],"Arizona":["Utah", "UDub", "U$C", "Stanfurd","UCLA"],"ASU":["Oregon","Colorado","U$C","Wazzu"],"Colorado":["U$C"],"U$C":["Utah","Stanfurd"], "UCLA":["Utah","ASU","Wazzu","Stanfurd"], "Stanfurd":["Colorado","UDub","Wazzu"]}
        for cycle1, cycle2 in zip(find_cycles(graph), [['Stanfurd', 'Colorado','U$C'], ['Oregon','Cal', 'ASU']]):
            self.assertSameCycle(cycle1, cycle2)

        #graph includes multiple fully connected components, one of which also has multiple disjoint cycles. Also tests for single outliers in a component (see element 15)
        graph = {1:[2],2:[3],3:[4],4:[1,5,8],5:[6,7],6:[7],7:[4],8:[9],9:[4,10],10:[8],11:[10,12],12:[13],13:[14],14:[11,15]}
        for cycle1, cycle2 in zip(find_cycles(graph), [[1, 2, 3, 4], [11, 12, 13, 14], [8, 9, 10]]):
            self.assertSameCycle(cycle1, cycle2)
