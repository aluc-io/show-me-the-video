import * as React from 'react'
import Error from 'next/error'

export default class Page extends React.Component {
  render() {
    return (
      <div>
        Custom error page
        <Error statusCode={1818}/>
      </div>
    )
  }
}

