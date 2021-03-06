import React from 'react';
import { useParams } from 'react-router-dom';
import { Heading, Spinner, Text, Divider, Flex, Box } from 'theme-ui';
import { useTranslations, Message } from 'retranslate';

import { useI18n } from '../common';
import { useTest, useTestTypes } from '../resources';
import { InterpretationBadge } from './InterpretationBadge';

export const TestDetailPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const { translate } = useTranslations();
  const { testTypes } = useTestTypes();
  const { test, loading } = useTest(testId);
  const { formatDate } = useI18n();

  if (loading || !test) {
    return <Spinner variant="spinner.main" />;
  }
  const testType = testTypes.find((type) => type.id === test?.testType.id);
  // TODO: Translate strings coming from the server
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
    label: translate('testDetailPage.results.label'),
    value: testType?.name,
  });

  return (
    <>
      <Heading as="h1" mb={2}>
        <Message>testDetailPage.heading</Message>
      </Heading>
      <Text mb={2}>
        <Message>testDetailPage.date</Message>: {formatDate(new Date(test!.creationTime))}
      </Text>
      {test.resultsInterpretations?.map((interpretation, index) => (
        <InterpretationBadge key={index} interpretation={interpretation} mr={2} />
      ))}
      {test?.results ? (
        <>
          <Text mt={5}>
            <Message>testDetailPage.resultDetails</Message>
          </Text>
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
                  <strong>
                    {typeof value === 'boolean'
                      ? value
                        ? translate('testDetailPage.yes')
                        : translate('testDetailPage.no')
                      : value}
                  </strong>
                </Text>
              ))}
            </Box>
          </Flex>
        </>
      ) : null}
      {test?.results?.notes ? (
        <>
          <Text mt={5}>
            <Message>testDetailPage.notes</Message>
          </Text>
          <Divider mb={3} />
          {test.results.notes}
        </>
      ) : null}
    </>
  );
};
