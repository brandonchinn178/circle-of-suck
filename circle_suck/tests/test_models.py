from django.test import TestCase

from base.models import School
from base.constants import PAC_12

class TestSchool(TestCase):
    def test_get(self):
        school = School.get('CAL')
        self.assertIsInstance(school, School)
        self.assertEqual(school.id, 'CAL')
        self.assertEqual(school.name, PAC_12['CAL'])
        self.assertTrue(school.logo.endswith('img/pac_12/cal.png'))

    def test_get_conference(self):
        schools = School.get_conference('PAC_12')
        self.assertEqual(len(schools), 12)
        self.assertIsInstance(schools[0], School)
