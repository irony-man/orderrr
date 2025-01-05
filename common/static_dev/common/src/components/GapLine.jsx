export default function GapLine({heading, value, width= 6, alignValue = 'left'}) {
  return (
    <div className="row my-3 justify-content-space-between">
      <div className={`col-${width}`}>{heading}</div>
      <div className={`col text-${alignValue}`}>{value}</div>
    </div>
  );
}
