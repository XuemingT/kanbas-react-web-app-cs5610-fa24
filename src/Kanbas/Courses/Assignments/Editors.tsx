export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <table>
        <label htmlFor="wd-name">Assignment Name</label>
        <br />
        <input id="wd-name" value="A1 - ENV + HTML" />
        <br />
        <br />
        <textarea id="wd-description" cols={45} rows={10}>
          The assignment is available online Submit a link to the landing page
          of your web applicaiton running on Netlify. The landing page should
          include the following: Your full name and your section links to each
          of lab assignment link to the kanbas applicaiton Links to all relavant
          source code repositories The Kanbas applicaiton should include a link
          to navigate back to the landing page.
        </textarea>
        <br />
        <table>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" value={100} />
            </td>
          </tr>
          {/* Complete on your own */}
        </table>
        <br />
        <label htmlFor="wd-group"> Assignment Group </label>
        <select id="wd-select-one-genre">
          <option selected value="ASSIGNMENT">
            ASSIGNMENTS
          </option>
          <option value="TESTS">TESTS</option>
          <option value="PROJECTS">PROJECTS</option>
          <option value="LABS">LABS</option>
        </select>
        <br />
        <br />
        <label htmlFor="wd-display-grade-as"> Display grade as: </label>
        <select id="wd-select-one-genre">
          <option selected value="PERCENTAGE">
            Percentage
          </option>
          <option value="LETTER">Letter</option>
        </select>
        <br />
        <br />
        <label htmlFor="wd-submission-type"> Submission type: </label>
        <select id="wd-select-one-genre">
          <option selected value="Online">
            ONLINE
          </option>
          <option value="INPERSON">IN-PERSON</option>
        </select>
        <br />
        <br />
        <label>Online Entry Option:</label>
        <br /> <input type="checkbox" name="check-genre" id="wd-text-entry" />
        <label htmlFor="wd-text-entry">Text Entry</label>
        <br /> <input type="checkbox" name="check-genre" id="wd-text-entry" />
        <label htmlFor="wd-website-url">Website URL</label>
        <br />{" "}
        <input type="checkbox" name="check-genre" id="wd-media-recording" />
        <label htmlFor="wd-chkbox-scifi">Media Recordings</label>
        <br />{" "}
        <input type="checkbox" name="check-genre" id="wd-student-annotation" />
        <label htmlFor="wd-chkbox-fantasy">Student Annotation</label>
        <br /> <input type="checkbox" name="check-genre" id="wd-file-uploads" />
        <label htmlFor="wd-chkbox-fantasy">File Uploads</label>
        <br />
        <br />
      </table>

      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-assign-to">Assign Assign to</label>
          </td>
          <td>
            <br />
            <input id="wd-assign" value="Everyone" />
          </td>
        </tr>

        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-due">Due</label>

            <br />
          </td>
          <td>
            <br />
            <input type="date" id="wd-due" value="2024-05-03" />
          </td>
        </tr>

        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-available"> Available from </label> <br />
          </td>
          <td>
            <br />
            <input type="date" id="wd-available" value="2024-05-06" />
            <br />{" "}
          </td>{" "}
          <td align="right" valign="top">
            <label htmlFor="wd-Until"> Until </label> <br />
          </td>
          <td>
            <br />
            <input type="date" id="wd-Until" value="2024-05-20" />
            <br />{" "}
          </td>{" "}
        </tr>
      </table>
    </div>
  );
}
