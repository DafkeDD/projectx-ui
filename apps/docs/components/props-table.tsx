import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@projectx/ui";
import { propsFor } from "../lib/props";

export function PropsTable({ name }: { name: string }) {
  const entry = propsFor(name);
  if (!entry || entry.props.length === 0) return null;

  return (
    <div className="docs-props">
      <h3 className="docs-h3">
        <code className="docs-inline-code">{name}</code>
      </h3>
      {entry.extends && (
        <p className="docs-p" style={{ marginTop: 6 }}>
          Erft daarnaast alle props van <code className="docs-inline-code">{entry.extends}</code>.
        </p>
      )}
      <Table dense minWidth={640}>
        <TableHeader>
          <TableRow>
            <TableHead>Prop</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Standaard</TableHead>
            <TableHead>Omschrijving</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entry.props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell strong>
                {prop.name}
                {prop.required && <span style={{ color: "var(--red)" }}>*</span>}
              </TableCell>
              <TableCell>
                <span className="docs-type">{prop.type}</span>
              </TableCell>
              <TableCell>
                <span className="docs-default">{prop.default ?? "—"}</span>
              </TableCell>
              <TableCell>{prop.description || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
