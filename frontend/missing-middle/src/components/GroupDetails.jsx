const GroupDetails = ({ selectedGroup, groupData, setSelectedGroup, year1, year2, city }) => {
  const hasGenderBreakdown = groupData.maleYear1 !== undefined;
  const capitalize = (str) => {
    if (!str) return '';
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };
  const groupLabel = selectedGroup === 'age' 
    ? `Population Aged ${groupData.ageGroup}` 
    : `${capitalize(groupData.raceGroup)} Population`;

  return (
    <div style={{
      position: 'relative',
      flex: '1 1 500px',
      minWidth: '450px',
      maxWidth: '600px',
      backgroundColor: 'var(--surface)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '2px solid var(--primary-color)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      maxHeight: '600px',
      overflowY: 'auto',
      animation: 'slideInRight 0.3s ease'
    }}>
      {/* Close button */}
      <button 
        onClick={() => setSelectedGroup(null)}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          padding: '0.25rem 0.5rem',
          lineHeight: 1
        }}>
          ×
      </button>

      {/* Panel content */}
      <h2 style={{ 
        marginTop: 0,
        paddingRight: '2rem',
        color: 'var(--primary-color)',
        fontSize: '1.4rem',
        marginBottom: '0.5rem'
      }}>
        {groupLabel} in {city}
      </h2>

      <h3 style={{ 
        color: 'var(--text-primary)', 
        fontSize: '1rem',
        marginBottom: '1rem',
        marginTop: 0
        }}>
        {year1} → {year2}
      </h3>

      <div>
        <div style={{ 
          backgroundColor: 'var(--surface-light)',
        }}>
          <span style={{ fontSize: '1.25rem' }}>
            <span style={{ 
              color: groupData.totalChange >= 0 ? '#16a34a' : '#dc2626',
              fontWeight: 'bold',
            }}>
              {groupData.totalChange >= 0 ? '+' : ''}
              {groupData.totalChange.toLocaleString()}
            </span>
            {' '}
            people
          </span>
        </div>

        {/* Only show gender breakdown if it exists */}
        {hasGenderBreakdown ? (
          <>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
              marginTop: '1rem'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--surface-light)' }}>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '0.25rem',
                    fontWeight: 'bold',
                    border: 'none',
                    width: '80px'
                  }}></th>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '0.25rem',
                    fontWeight: 'bold',
                    border: 'none'
                  }}>{year1}</th>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '0.25rem',
                    fontWeight: 'bold',
                    border: 'none'
                  }}>{year2}</th>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '0.25rem',
                    fontWeight: 'bold',
                    border: 'none'
                  }}>Change</th>
                </tr>
              </thead>
              <tbody>
                {/* Male row */}
                <tr style={{ backgroundColor: 'var(--surface-light)' }}>
                  <td style={{ 
                    padding: '0.5rem 0.25rem',
                    fontWeight: 'bold',
                    borderLeft: '3px solid steelblue',
                    border: 'none',
                    width: '80px'
                  }}>
                    Men
                  </td>
                  <td style={{ 
                    textAlign: 'left', 
                    padding: '0.5rem 0.25rem',
                    border: 'none'
                  }}>
                    {groupData.maleYear1.toLocaleString()}
                  </td>
                  <td style={{ 
                    textAlign: 'left', 
                    padding: '0.5rem 0.25rem',
                    border: 'none'
                  }}>
                    {groupData.maleYear2.toLocaleString()}
                  </td>
                  <td style={{ 
                    textAlign: 'left', 
                    padding: '0.5rem 0.25rem',
                    border: 'none'
                  }}>
                    <span style={{ color: groupData.maleChange >= 0 ? '#16a34a' : '#dc2626' }}>
                      {groupData.maleChange >= 0 ? '+' : ''}
                      {groupData.maleChange.toLocaleString()}
                    </span>
                    {' '}
                    ({groupData.malePercentChange.toFixed(1)}%)
                  </td>
                </tr>
                
                {/* Female row */}
                <tr style={{ backgroundColor: 'var(--surface-light)' }}>
                  <td style={{ 
                    padding: '0.5rem 0.25rem',
                    fontWeight: 'bold',
                    borderLeft: '3px solid lightcoral',
                    border: 'none',
                    width: '80px'
                  }}>
                    Women
                  </td>
                  <td style={{ 
                    textAlign: 'left', 
                    padding: '0.5rem 0.25rem',
                    border: 'none'
                  }}>
                    {groupData.femaleYear1.toLocaleString()}
                  </td>
                  <td style={{ 
                    textAlign: 'left', 
                    padding: '0.5rem 0.25rem',
                    border: 'none'
                  }}>
                    {groupData.femaleYear2.toLocaleString()}
                  </td>
                  <td style={{ 
                    textAlign: 'left', 
                    padding: '0.5rem 0.25rem',
                    border: 'none'
                  }}>
                    <span style={{ color: groupData.femaleChange >= 0 ? '#16a34a' : '#dc2626' }}>
                      {groupData.femaleChange >= 0 ? '+' : ''}
                      {groupData.femaleChange.toLocaleString()}
                    </span>
                    {' '}
                    ({groupData.femalePercentChange.toFixed(1)}%)
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          /* No gender breakdown - show single row */
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
            marginTop: '1rem'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--surface-light)' }}>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '0.25rem',
                  fontWeight: 'bold',
                  border: 'none',
                  width: '60px'
                }}>{year1}</th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '0.25rem',
                  fontWeight: 'bold',
                  border: 'none',
                  width: '60px'
                }}>{year2}</th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '0.25rem',
                  fontWeight: 'bold',
                  border: 'none'
                }}>Change</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: 'var(--surface-light)' }}>
                <td style={{ 
                  textAlign: 'left', 
                  padding: '0.5rem 0.25rem',
                  border: 'none'
                }}>
                  {groupData.year1?.toLocaleString()}
                </td>
                <td style={{ 
                  textAlign: 'left', 
                  padding: '0.5rem 0.25rem',
                  border: 'none'
                }}>
                  {groupData.year2?.toLocaleString()}
                </td>
                <td style={{ 
                  textAlign: 'left', 
                  padding: '0.5rem 0.25rem',
                  color: groupData.totalChange >= 0 ? '#16a34a' : '#dc2626',
                  border: 'none'
                }}>
                    {groupData.totalChange >= 0 ? '+' : ''}
                    {groupData.percentChange?.toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;