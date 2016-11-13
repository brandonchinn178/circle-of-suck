from django.test import TestCase
from base.utils import *

class TestCycleFinder(TestCase):
	def test_single_cycle(self):
		#base test to find simple cycle (and template for other tests)
		graph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[6,9],9:[]}
		self.assertEqual(find_all_connected(graph), [[8, 6, 7]])
		
		#find a larger cycle rather than the subcycle within it
		graph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[2,6,9],9:[]}
		self.assertEqual(find_all_connected(graph), [[2, 5, 6, 7, 8]])

		#find one of two equal-length (but not disjoint) cycles
		graph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[5,8],8:[6,9],9:[]}
		output = find_all_connected(graph)
		self.assertTrue(output == [[8, 6, 7]] or output == [[5, 6, 7]])
		
		#choose the longer of two conflicting cycles
		graph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[2,3,6,9],9:[]}
		self.assertEqual(find_all_connected(graph), [[3, 4, 5, 6, 7, 8]])

		#choose the longest of three cycles which conflict in several parts of the graph
		graph = {1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[2,3,6,9],9:[3]}
		self.assertEqual(find_all_connected(graph), [[3, 4, 5, 6, 7, 8, 9]])
		
		#handle a very complex graph with multiple confusing connections
		graph = {1:[2],2:[1,5],3:[1,4],4:[3,5],5:[6],6:[7],7:[8],8:[2,3,6,9],9:[3]}
		self.assertEqual(find_all_connected(graph), [[1, 2, 5, 6, 7, 8, 9, 3]])
		
		#test with real-life data from 10/30/16. Ensures string compatibility and protects from any unforseen real-world errors
		graph = {"Utah":["UDub","Cal"],"UDub":[],"Wazzu":[],"OSU":["Utah","Wazzu","UDub","Colorado"],"Cal":["OSU","ASU", "U$C"],"Oregon":["UDub", "Wazzu", "Cal","Colorado"],"Arizona":["Utah", "UDub", "U$C", "Stanfurd","UCLA"],"ASU":["Oregon","Colorado","U$C","Wazzu"],"Colorado":["U$C"],"U$C":["Utah","Stanfurd"], "UCLA":["Utah","ASU","Wazzu","Stanfurd"], "Stanfurd":["Colorado","UDub","Wazzu"]}
		self.assertEqual(find_all_connected(graph), [['Oregon', 'Colorado', 'U$C', 'Utah', 'Cal', 'ASU']])

		#test complete circle of suck
		graph = {"Utah":["UDub","Cal"],"UDub":["Arizona"],"Wazzu":["UDub"],"OSU":["Utah","Wazzu","UDub","Colorado"],"Cal":["OSU","ASU", "U$C"],"Oregon":["UDub", "Wazzu", "Cal","Colorado"],"Arizona":["Utah", "UDub", "U$C", "Stanfurd","UCLA"],"ASU":["Oregon","Colorado","U$C","Wazzu"],"Colorado":["U$C"],"U$C":["Utah","Stanfurd"], "UCLA":["Utah","ASU","Wazzu","Stanfurd"], "Stanfurd":["Colorado","UDub","Wazzu","OSU"]}
		self.assertEqual(find_all_connected(graph), [['Arizona', 'UCLA', 'Utah', 'Cal', 'ASU', 'Oregon', 'Colorado', 'U$C', 'Stanfurd', 'OSU', 'Wazzu', 'UDub']])


	def test_multiple_cycles(self):
		#graph includes multiple disjoint cycles in the same fully connected component
		graph = {1:[2],2:[3],3:[4],4:[1,5,8],5:[6,7],6:[7],7:[4],8:[9],9:[4,10],10:[8]}
		self.assertEqual(find_all_connected(graph), [[1, 2, 3, 4], [8, 9, 10]])
		
		#graph includes multiple fully connected components with one cycle each. Also tests real-world data.
		graph = {"Utah":["UDub"],"UDub":[],"Wazzu":[],"OSU":["Utah","Wazzu","UDub","Colorado"],"Cal":["OSU","ASU", "U$C"],"Oregon":["UDub", "Wazzu", "Cal","Colorado"],"Arizona":["Utah", "UDub", "U$C", "Stanfurd","UCLA"],"ASU":["Oregon","Colorado","U$C","Wazzu"],"Colorado":["U$C"],"U$C":["Utah","Stanfurd"], "UCLA":["Utah","ASU","Wazzu","Stanfurd"], "Stanfurd":["Colorado","UDub","Wazzu"]}
		self.assertEqual(find_all_connected(graph), [['Stanfurd', 'Colorado', 'U$C'], ['Oregon', 'Cal', 'ASU']])

		#graph includes multiple fully connected components, one of which also has multiple disjoint cycles. Also tests for single outliers in a component (see element 15)
		graph = {1:[2],2:[3],3:[4],4:[1,5,8],5:[6,7],6:[7],7:[4],8:[9],9:[4,10],10:[8],11:[10,12],12:[13],13:[14],14:[11,15]}
		self.assertEqual(find_all_connected(graph), [[1, 2, 3, 4], [11, 12, 13, 14], [8, 9, 10]])