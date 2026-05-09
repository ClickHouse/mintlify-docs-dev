/**
 * SettingsInfoBlock — compact "Type / Default / Changeable" summary for a
 * setting, rendered inside an <Accordion> so it doesn't take vertical space
 * when the reader is skimming.
 *
 * Mintlify equivalent of clickhouse-docs's `src/theme/SettingsInfoBlock`.
 *
 * Usage:
 *   import SettingsInfoBlock from "/snippets/components/SettingsInfoBlock/SettingsInfoBlock.jsx";
 *
 *   <SettingsInfoBlock type="Bool" default_value="0" />
 *   <SettingsInfoBlock type="String" default_value="''" changeable_without_restart="No" />
 */
const SettingsInfoBlock = ({ type, default_value, changeable_without_restart }) => {
  const cells = [
    ["Type", type],
    ["Default value", default_value],
  ];
  if (changeable_without_restart) {
    cells.push(["Changeable without restart", changeable_without_restart]);
  }
  return (
    <Accordion title="Settings info">
      <table>
        <thead>
          <tr>
            {cells.map(([h]) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {cells.map(([h, v]) => (
              <td key={h}>{v}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </Accordion>
  );
};

export default SettingsInfoBlock;