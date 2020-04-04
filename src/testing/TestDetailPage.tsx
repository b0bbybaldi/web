import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Heading, Spinner, Text, Divider, Flex, Box } from 'theme-ui';
import { format } from 'date-fns';

import { useTest, useTestTypes } from '../resources';
import { FieldValue } from '../api';

export const TestDetailPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const { testTypes } = useTestTypes();
  const { test, loading } = useTest(testId);
  if (loading || !test) {
    return <Spinner variant="spinner.main" />;
  }
  const testType = testTypes.find(type => type.id === test?.testTypeId);
  const testResults =
    test?.results && testType
      ? Object.entries(testType.resultsSchema.properties).map(([key, value]) => {
          return {
            label: value.title,
            value: test?.results?.details[key],
          };
        })
      : [];
  testResults.unshift({
    label: 'Test type',
    value: testType?.name,
  });
  return (
    <Container variant="page">
      <Heading as="h1" mb={5}>
        Test result
      </Heading>
      <Text mb={5}>Test date: {format(new Date(test!.creationTime), 'd MMM yyyy')}</Text>
      {test?.results ? (
        <>
          <Text>Details</Text>
          <Divider mb={3} />
          <Flex>
            <Box sx={{ display: 'grid', gridGap: 2 }}>
              {testResults.map(({ label }, index) => (
                <Text key={index}>{label}:</Text>
              ))}
            </Box>
            <Box ml={5} sx={{ display: 'grid', gridGap: 2 }}>
              {testResults.map(({ value }, index) => (
                <Text key={index}>
                  <strong>{showValue(value!)}</strong>
                </Text>
              ))}
            </Box>
          </Flex>
        </>
      ) : null}
      {test?.results?.notes ? (
        <>
          <Text mt={5}>Notes</Text>
          <Divider mb={3} />
          {test.results.notes}
        </>
      ) : null}
    </Container>
  );
};

function showValue(value: FieldValue) {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return value;
}
