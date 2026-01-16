const ControlPanel = ({ year1, year2, city, setYear1, setYear2, setCity }) => {
    return (
      <div className="controls-card compact">
        <div className="controls-grid">
          <div className="control-group">
            <label className="control-label" htmlFor="year1-select">Year 1</label>
            <select id="year1-select" value={year1} onChange={e => setYear1(e.target.value)}>
            {/* Could derive these from the CSV file in the future */}
              <option value="1990">1990</option>
              <option value="2000">2000</option>
              <option value="2010">2010</option>
              <option value="2020">2020</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label" htmlFor="year2-select">Year 2</label>
            <select id="year2-select" value={year2} onChange={e => setYear2(e.target.value)}>
            {/* Could derive these from the CSV file in the future */}
              <option value="1990">1990</option>
              <option value="2000">2000</option>
              <option value="2010">2010</option>
              <option value="2020">2020</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label" htmlFor="city-select">City</label>
            <select id="city-select" value={city} onChange={e => setCity(e.target.value)}>
              {/* Could derive these from the CSV file in the future */}
              <option value="Acton">Acton</option>
              <option value="Arlington">Arlington</option>
              <option value="Ashland">Ashland</option>
              <option value="Avon">Avon</option>
              <option value="Bedford">Bedford</option>
              <option value="Bellingham">Bellingham</option>
              <option value="Belmont">Belmont</option>
              <option value="Beverley">Beverley</option>
              <option value="Boston">Boston</option>
              <option value="Boxborough">Boxborough</option>
              <option value="Braintree">Braintree</option>
              <option value="Brookline">Brookline</option>
              <option value="Burlington">Burlington</option>
              <option value="Cambridge">Cambridge</option>
              <option value="Canton">Canton</option>
              <option value="Carlisle">Carlisle</option>
              <option value="Chelsea">Chelsea</option>
              <option value="Cohasset">Cohasset</option>
              <option value="Concord">Concord</option>
              <option value="Danvers">Danvers</option>
              <option value="Dedham">Dedham</option>
              <option value="Dover">Dover</option>
              <option value="Duxbury">Duxbury</option>
              <option value="Essex">Essex</option>
              <option value="Everett">Everett</option>
              <option value="Foxborough">Foxborough</option>
              <option value="Framingham">Framingham</option>
              <option value="Franklin">Franklin</option>
              <option value="Gloucester">Gloucester</option>
              <option value="Hamilton">Hamilton</option>
              <option value="Hanover">Hanover</option>
              <option value="Hingham">Hingham</option>
              <option value="Holliston">Holliston</option>
              <option value="Holbrook">Holbrook</option>
              <option value="Hopkinson">Hopkinson</option>
              <option value="Hudson">Hudson</option>
              <option value="Hull">Hull</option>
              <option value="Ipswich">Ipswich</option>
              <option value="Lexington">Lexington</option>
              <option value="Lincoln">Lincoln</option>
              <option value="Littleton">Littleton</option>
              <option value="Lynn">Lynn</option>
              <option value="Lynnfield">Lynnfield</option>
              <option value="Malden">Malden</option>
              <option value="Manchester">Manchester</option>
              <option value="Marblehead">Marblehead</option>
              <option value="Marlborough">Marlborough</option>
              <option value="Marshfield">Marshfield</option>
              <option value="Maynard">Maynard</option>
              <option value="Medfield">Medfield</option>
              <option value="Medford">Medford</option>
              <option value="Medway">Medway</option>
              <option value="Melrose">Melrose</option>
              <option value="Middleton">Middleton</option>
              <option value="Millis">Millis</option>
              <option value="Milton">Milton</option>
              <option value="Nahant">Nahant</option>
              <option value="Natick">Natick</option>
              <option value="Needham">Needham</option>
              <option value="Newtown">Newtown</option>
              <option value="Norfolk">Norfolk</option>
              <option value="North Reading">North Reading</option>
              <option value="Norwell">Norwell</option>
              <option value="Norwood">Norwood</option>
              <option value="Peabody">Peabody</option>
              <option value="Pembroke">Pembroke</option>
              <option value="Quincy">Quincy</option>
              <option value="Randolph">Randolph</option>
              <option value="Reading">Reading</option>
              <option value="Revere">Revere</option>
              <option value="Rockland">Rockland</option>
              <option value="Rockport">Rockport</option>
              <option value="Salem">Salem</option>
              <option value="Saugus">Saugus</option>
              <option value="Scituate">Scituate</option>
              <option value="Sharon">Sharon</option>
              <option value="Sherborn">Sherborn</option>
              <option value="Somerville">Somerville</option>
              <option value="Stoneham">Stoneham</option>
              <option value="Stoughton">Stoughton</option>
              <option value="Stow">Stow</option>
              <option value="Sudbury">Sudbury</option>
              <option value="Swampscott">Swampscott</option>
              <option value="Topsfield">Topsfield</option>
              <option value="Wakefield">Wakefield</option>
              <option value="Walpole">Walpole</option>
              <option value="Waltham">Waltham</option>
              <option value="Watertown">Watertown</option>
              <option value="Wayland">Wayland</option>
              <option value="Wenham">Wenham</option>
              <option value="Weston">Weston</option>
              <option value="Westwood">Westwood</option>
              <option value="Weymouth">Weymouth</option>
              <option value="Willmington">Willmington</option>
              <option value="Winchester">Winchester</option>
              <option value="Winthrop">Winthrop</option>
              <option value="Woburn">Woburn</option>
              <option value="Wrentham">Wrentham</option>
            </select>
          </div>
        </div>
      </div>
    );
};

export default ControlPanel;