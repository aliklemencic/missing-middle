const GroupDetails = ({ selectedGroup, groupData, setSelectedGroup, year1, year2, city }) => {
  // Age groups have gender breakdown (male/female), race groups don't
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
    <div className="group-details-panel">
      {/* Close button */}
      <button 
        onClick={() => setSelectedGroup(null)}
        className="group-details-close">
          ×
      </button>

      {/* Panel content */}
      <h2 className="group-details-title">
        {groupLabel} in {city}
      </h2>

      <h3 className="group-details-subtitle">
        {year1} → {year2}
      </h3>

      <div>
        <div className="group-details-summary">
          <span className="group-details-summary-text">
            <span className={groupData.totalChange >= 0 ? 'group-details-change-positive' : 'group-details-change-negative'}>
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
            <table className="data-table">
              <thead>
                <tr>
                  <th className="narrow"></th>
                  <th>{year1}</th>
                  <th>{year2}</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {/* Male row */}
                <tr>
                  <td className="border-left-male">
                    Men
                  </td>
                  <td>
                    {groupData.maleYear1.toLocaleString()}
                  </td>
                  <td>
                    {groupData.maleYear2.toLocaleString()}
                  </td>
                  <td>
                    <span className={groupData.maleChange >= 0 ? 'group-details-change-positive' : 'group-details-change-negative'}>
                      {groupData.maleChange >= 0 ? '+' : ''}
                      {groupData.maleChange.toLocaleString()}
                    </span>
                    {' '}
                    ({groupData.malePercentChange.toFixed(1)}%)
                  </td>
                </tr>
                
                {/* Female row */}
                <tr>
                  <td className="border-left-female">
                    Women
                  </td>
                  <td>
                    {groupData.femaleYear1.toLocaleString()}
                  </td>
                  <td>
                    {groupData.femaleYear2.toLocaleString()}
                  </td>
                  <td>
                    <span className={groupData.femaleChange >= 0 ? 'group-details-change-positive' : 'group-details-change-negative'}>
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
          <table className="data-table">
            <thead>
              <tr>
                <th className="medium">{year1}</th>
                <th className="medium">{year2}</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {groupData.year1?.toLocaleString()}
                </td>
                <td>
                  {groupData.year2?.toLocaleString()}
                </td>
                <td className={groupData.totalChange >= 0 ? 'group-details-change-positive' : 'group-details-change-negative'}>
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