import { Tooltip, Skeleton, useTheme, useColorMode } from '@chakra-ui/core';
import format from 'date-fns/format';
import React from 'react';
import { pluralizeContributions } from '../lib/formatters';
import { ContributionCalendar as ContributionCalendarType } from '../graphql/types';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const contributionCalendarFragment = `
  fragment contributionCalendar on ContributionCalendar {
    totalContributions
    weeks {
      firstDay
      contributionDays {
        date
        contributionCount
        color
      }
    }
    months {      
      firstDay
      name
      totalWeeks
      year
    }
  }
`;

export type PartialContributionCalendar = Pick<
  ContributionCalendarType,
  'totalContributions' | 'weeks' | 'months'
>;

interface Props {
  contributionCalendar?: PartialContributionCalendar;
}

function monthX(months, monthIndex) {
  if (monthIndex === 0) {
    return 0;
  } else {
    const monthsRange = months.slice(0, monthIndex);

    return monthsRange.reduce(
      (accumulator, currentValue) => accumulator + currentValue.totalWeeks,
      0
    );
  }
}

const ContributionCalendar: React.FC<Props> = ({
  contributionCalendar: data,
}) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const defaultSquareColor =
    colorMode === 'light' ? theme.colors.gray[100] : theme.colors.gray[700];

  if (!data) {
    return <Skeleton height="200px" />;
  }

  const totalWeeks = data.weeks.length;
  const calXOffset = 30;
  const calYOffset = 20;
  const cellSpacing = 4;
  const cellSize = 20;
  const cellSpacesX = (totalWeeks - 1) * cellSpacing;
  const cellSpacesY = (7 - 1) * cellSpacing;
  const calWidth = cellSpacesX + totalWeeks * cellSize;
  const svgWidth = calXOffset + calWidth;
  const svgHeight = calYOffset + cellSize * 7 + cellSpacesY;

  return (
    <div style={{ overflowY: 'scroll', direction: 'rtl' }}>
      <svg width={svgWidth} height={svgHeight} direction="ltr">
        {data.weeks.map((week, weekIndex) => (
          <g
            key={week.firstDay}
            transform={`translate(${
              calXOffset + weekIndex * (cellSize + cellSpacing)
            }, ${calYOffset})`}
          >
            {week.contributionDays.map((day, i) => (
              <Tooltip
                key={day.date}
                label={`${day.contributionCount} ${pluralizeContributions(
                  day.contributionCount
                )} on ${format(new Date(day.date), 'PP')}`}
                aria-label="A tooltip"
                placement="auto"
              >
                <rect
                  width={20}
                  height={20}
                  rx="2"
                  x="0"
                  y={
                    (cellSize + cellSpacing) *
                    (weekIndex === 0 ? 7 - week.contributionDays.length + i : i)
                  }
                  fill={
                    day.color === '#ebedf0' ? defaultSquareColor : day.color
                  }
                ></rect>
              </Tooltip>
            ))}
          </g>
        ))}
        <g fill="currentColor">
          {data.months.map((month, monthIndex) => (
            <text
              key={month.name + month.year}
              fontSize={12}
              display={month.totalWeeks > 2 ? 'initial' : 'none'}
              x={
                calXOffset +
                monthX(data.months, monthIndex) * (cellSize + cellSpacing)
              }
              y="10"
            >
              {month.name}
            </text>
          ))}
        </g>
        <g fill="currentColor">
          {days.map((day, dayIndex) => (
            <text
              key={day}
              fontSize={12}
              display={dayIndex % 2 !== 0 ? 'initial' : 'none'}
              dominantBaseline="middle"
              x={0}
              y={
                calYOffset + cellSize / 2 + dayIndex * (cellSize + cellSpacing)
              }
            >
              {day}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default ContributionCalendar;
