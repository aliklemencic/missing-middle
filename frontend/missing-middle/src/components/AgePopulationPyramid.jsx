import { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';
import GroupDetails from './GroupDetails';

const AgePopulationPyramid = ({ data, year1, year2, city }) => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);

  // Transform data into arrays for Plotly
  const ageGroups = Object.keys(data.year1);
  const combinedChange = ageGroups.map(ag => data.changes[ag].total_change_absolute);
  const combinedChangeColors = ageGroups.map(ag => data.changes[ag].total_color);

  // Calculate dynamic tick values based on data range
  const xAxisConfig = useMemo(() => {
    const maxAbsValue = Math.max(...combinedChange.map(Math.abs));
    
    // Round up to nearest nice number (500, 1000, 2000, etc.)
    const roundTo = maxAbsValue > 2000 ? 1000 : 
                    maxAbsValue > 1000 ? 500 : 
                    maxAbsValue > 500 ? 250 : 100;
    
    const maxRounded = Math.ceil(maxAbsValue / roundTo) * roundTo;
    
    // Generate symmetric tick values
    const numTicks = 7; // Odd number for symmetry around zero
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
    setSelectedAgeGroup(null);
  }, [year1, year2, city]);

  const handleAgeGroupClick = (event) => {
    if (event.points && event.points.length > 0) {
      const pointIndex = event.points[0].pointIndex;
      const ageGroup = ageGroups[pointIndex];

      const year1Data = data.year1[ageGroup];
      const year2Data = data.year2[ageGroup];
      const changeData = data.changes[ageGroup];
      
      const details = {
        ageGroup: ageGroup,
        maleYear1: year1Data.male,
        maleYear2: year2Data.male,
        femaleYear1: year1Data.female,
        femaleYear2: year2Data.female,
        totalYear1: year1Data.total,
        totalYear2: year2Data.total,
        totalChange: changeData.total_change_absolute,
        maleChange: changeData.male_change_absolute,
        femaleChange: changeData.female_change_absolute,
        malePercentChange: changeData.male_change_percent,
        femalePercentChange: changeData.female_change_percent,
        totalPercentChange: changeData.total_change_percent,
      };

      setSelectedAgeGroup(details);
    }
  };

  return (
    <div className="population-pyramid-container">

      {/* Bottom Panel - Chart and Data */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>

        {/* Left column - Chart */}
        <div className="chart-column" style={{ flex: '0 1 800px', minWidth: '400px', maxWidth: '700px' }}>
          <h2 style={{ 
            marginTop: 0,
            paddingRight: '2rem',
            color: 'var(--primary-color)',
            fontSize: '1.4rem',
            marginBottom: '1.5rem'
          }}>
            Population Change by Age Group
          </h2>

          <p style={{ 
            marginTop: '-1rem',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>Click an age group to see more details.</p>

<Plot
            data={[
              {
                x: combinedChange,
                y: ageGroups,
                type: 'bar',
                orientation: 'h',
                name: 'Total Change per Age Group',
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
              yaxis: { title: 'Age Group' },
              bargap: 0.1,
              template: 'plotly_white',
              height: 500,
              margin: { t: 25, b: 40, l: 70, r: 15 },
              paper_bgcolor: 'rgba(241, 245, 249, 0.5)',
              plot_bgcolor: 'rgba(241, 245, 249, 0.5)',
              dragmode: false,
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
            onClick={handleAgeGroupClick}
          />
        </div>

        {/* Right Column - Age Group Details */}
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
          {selectedAgeGroup && (
          <GroupDetails
            selectedGroup="age"
            groupData={selectedAgeGroup}
            setSelectedGroup={setSelectedAgeGroup}
            year1={year1}
            year2={year2}
            city={city}
          />
          )}
        </div>
      </div>
    </div>
  );
};

export default AgePopulationPyramid;
