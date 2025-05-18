

export default function Routes() {
  return (
    <>
      <Routes>
          <Route  path="/" element={<Component />} /> 
        <Route path="*" element={<NotFound />} />
        {/*routes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))*/}
      </Routes>
    </>
  );
}

