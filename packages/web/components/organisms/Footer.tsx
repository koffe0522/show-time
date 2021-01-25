import React from 'react';

function Copyright() {
  return (
    <React.Fragment>
      {'© '}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

export default function AppFooter() {
  return <footer></footer>;
}
