import { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';
import GroupDetails from './GroupDetails';

const RacePopulationPyramid = ({ data, year1, year2, city }) => {
  const [selectedRaceGroup, setSelectedRaceGroup] = useState(null);

  // Transform data into arrays for Plotly
  const raceGroups = Object.keys(data.year1);
  const combinedChange = raceGroups.map(ag => data.changes[ag].change_absolute);
  const combinedChangeColors = raceGroups.map(ag => data.changes[ag].color);

  // Calculate dynamic tick values based on data range
  const xAxisConfig = useMemo(() => {
    const maxAbsValue = Math.max(...combinedChange.map(Math.abs));
    
    // Round up to nearest nice number
    const roundTo = maxAbsValue > 5000 ? 2000 : 
                    maxAbsValue > 2000 ? 1000 : 
                    maxAbsValue > 1000 ? 500 : 250;
    
    const maxRounded = Math.ceil(maxAbsValue / roundTo) * roundTo;
    
    // Generate symmetric tick values
    const numTicks = 7;
    const step = Math.ceil(maxRounded / Math.floor(numTicks / 2));
    
    const tickvals = [];
    const ticktext = [];
    
    for (let i = -Math.floor(numTicks / 2); i <= Math.floor(numTicks / 2); i++) {
      const value = i * step;
      tickvals.push(value);
      ticktext.push(Math.abs(value).toLocaleString());
    }
    
    return { tickvals, ticktext };
  }, [combinedChange]);

  // Reset selection when data changes
  useEffect(() => {
    setSelectedRaceGroup(null);
  }, [year1, year2, city]);

  const handleRaceGroupClick = (event) => {
    if (event.points && event.points.length > 0) {
      const pointIndex = event.points[0].pointIndex;
      const raceGroup = raceGroups[pointIndex];

      const year1Data = data.year1[raceGroup];
      const year2Data = data.year2[raceGroup];
      const changeData = data.changes[raceGroup];
      
      const details = {
        raceGroup: raceGroup,
        year1: year1Data,
        year2: year2Data,
        totalChange: changeData.change_absolute,
        percentChange: changeData.change_percent,
      };

      setSelectedRaceGroup(details);
    }
  };

  return (
    <div className="population-pyramid-container">

      {/* Chart and Data */}
      <div className="flex-container">

        {/* Left Column - Racial Group Details */}
        <div className="details-wrapper">
          {/* Top section - Key Insights */}
          <div className="insights-wrapper">
            <div className="insights-grid">
              <div className="insight-text">
                <h3 className="insight-title">
                  Key Insights
                </h3>
                <p>{data.sentences?.[0]}</p>
                <p>{data.sentences?.[1]}</p>
              </div>
            </div>
          </div>

          {/* Bottom section - Age Group Details */}
          {selectedRaceGroup && (
          <GroupDetails
            selectedGroup="race"
            groupData={selectedRaceGroup}
            setSelectedGroup={setSelectedRaceGroup}
            year1={year1}
            year2={year2}
            city={city}
          />
          )}
        </div>


        {/* Right column - Chart */}
        <div className="chart-wrapper">
          <h2 className="section-title">
            Population Change by Racial Group
          </h2>

          <p className="section-subtitle">Click a racial group to see more details.</p>

<Plot
            data={[
              {
                x: combinedChange,
                y: raceGroups,
                type: 'bar',
                orientation: 'h',
                name: 'Total Change per Racial Group',
                marker: { color: combinedChangeColors },
                showlegend: false,
                hovertemplate: 
                  `<b>%{y}</b><br>` +
                  `Change: %{x:+,}` +
                  `<extra></extra>`
              }
            ]}
            layout={{
              xaxis: {
                tickvals: xAxisConfig.tickvals,
                ticktext: xAxisConfig.ticktext,
                title: 'Population Change'
              },
              yaxis: { title: 'Racial Group' },
              bargap: 0.1,
              template: 'plotly_white',
              height: 400,
              margin: { t: 25, b: 40, l: 70, r: 15 },
              paper_bgcolor: 'rgba(241, 245, 249, 0.5)',
              plot_bgcolor: 'rgba(241, 245, 249, 0.5)',
              font: {
                color: '#475569'
              },
              hoverlabel: {
                bgcolor: 'rgba(241, 245, 249, 0.95)',
                bordercolor: '#cbd5e1',
                font: {
                  color: '#1e293b',
                  size: 13,
                  family: 'inherit'
                },
                namelength: -1
              }
            }}
            config={{ responsive: true, displayModeBar: false }}
            onClick={handleRaceGroupClick}
          />
        </div>
      </div>
    </div>
  );
};

export default RacePopulationPyramid;
