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

  // Reset selection when data changes (no setTimeout!)
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
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>


        {/* Left Column - Racial Group Details */}
        <div style={{
          position: 'relative',
          flex: '1 1 500px',
          minWidth: '450px',
          maxWidth: '600px',
          backgroundColor: 'var(--surface)',
          padding: '2rem',
          marginTop: '1.5rem',
          maxHeight: '600px',
          overflowY: 'auto',
        }}>
          {/* Top section - Key Insights */}
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '0.75rem',
            padding: '0rem',
            marginBottom: '2rem',
          }}>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              <div className="insight-text" style={{
                padding: '1rem',
                backgroundColor: 'var(--surface-light)',
                borderRadius: '0.5rem',
                borderLeft: '4px solid var(--primary-color)',
                margin: 0,
                lineHeight: '1.6'
              }}>
                <h3 style={{ 
                  marginTop: 0,
                  marginBottom: '1rem',
                  color: 'var(--text-primary)',
                  fontSize: '1.25rem',
                }}>
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
            setSelectedeGroup={setSelectedRaceGroup}
            year1={year1}
            year2={year2}
            city={city}
          />
          )}
        </div>


        {/* Right column - Chart */}
        <div className="chart-column" style={{ flex: '0 1 800px', minWidth: '400px', maxWidth: '700px' }}>
          <h2 style={{ 
            marginTop: 0,
            paddingRight: '2rem',
            color: 'var(--primary-color)',
            fontSize: '1.4rem',
            marginBottom: '1.5rem'
          }}>
            Population Change by Racial Group
          </h2>

          <p style={{ 
            marginTop: '-1rem',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>Click a racial group to see more details.</p>

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
