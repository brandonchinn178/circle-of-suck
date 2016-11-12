from django.test import TestCase
from base.utils import *

class TestCycleFinder(TestCase):
	def test_single_cycle(self):
		self.assertEqual(find_all_connected({1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[6,9],9:[]}), [[8, 6, 7]])
		self.assertEqual(find_all_connected({1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[2,6,9],9:[]}), [[2, 5, 6, 7, 8]])
		self.assertTrue(self.assertEqual(find_all_connected({1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[5,8],8:[6,9],9:[]}), [[8, 6, 7]]) or self.assertEqual(find_all_connected({1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[5,8],8:[6,9],9:[]}), [[5, 6, 7]]))
		self.assertEqual(find_all_connected({1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[6,9],9:[5]}), [[8, 9, 5, 6, 7]])
		self.assertEqual(find_all_connected({1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[2,3,6,9],9:[]}), [[3, 4, 5, 6, 7, 8]])
		self.assertEqual(find_all_connected({1:[2],2:[1,5],3:[4],4:[3,5],5:[6],6:[7],7:[8],8:[2,3,6,9],9:[3]}), [[3, 4, 5, 6, 7, 8, 9]])
		self.assertEqual(find_all_connected({1:[2],2:[1,5],3:[1,4],4:[3,5],5:[6],6:[7],7:[8],8:[2,3,6,9],9:[3]}), [[1, 2, 5, 6, 7, 8, 9, 3]])
		self.assertEqual(find_all_connected({"Utah":["UDub","Cal"],"UDub":[],"OSU":["Utah","Wazzu","UDub","Colorado"],"Cal":["OSU","ASU", "U$C"],"Oregon":["UDub", "Wazzu", "Cal","Colorado"],"Arizona":["Utah", "UDub", "U$C", "Stanfurd","UCLA"],"ASU":["Oregon","Colorado","U$C","Wazzu"],"Colorado":["U$C"],"U$C":["Utah","Stanfurd"], "UCLA":["Utah","ASU","Wazzu","Stanfurd"], "Stanfurd":["Colorado","UDub","Wazzu"]}), [['ASU', 'Oregon', 'Colorado', 'U$C', 'Utah', 'Cal']])

	def test_multiple_cycles(self):
		self.assertEqual(find_all_connected({1:[2],2:[3],3:[4],4:[1,5,8],5:[6,7],6:[7],7:[4],8:[9],9:[4,10],10:[8]}), [[1, 2, 3, 4], [8, 9, 10]])
		self.assertEqual(find_all_connected({"Utah":["UDub"],"UDub":[],"OSU":["Utah","Wazzu","UDub","Colorado"],"Cal":["OSU","ASU", "U$C"],"Oregon":["UDub", "Wazzu", "Cal","Colorado"],"Arizona":["Utah", "UDub", "U$C", "Stanfurd","UCLA"],"ASU":["Oregon","Colorado","U$C","Wazzu"],"Colorado":["U$C"],"U$C":["Utah","Stanfurd"], "UCLA":["Utah","ASU","Wazzu","Stanfurd"], "Stanfurd":["Colorado","UDub","Wazzu"]}), [['Colorado', 'U$C', 'Stanfurd'], ['Oregon', 'Cal', 'ASU']])