import { Table, useAsyncList, useCollator } from "@nextui-org/react";

export default function App() {
  const collator = useCollator({ numeric: true });
  async function load({ signal }) {
    const res = await fetch(
      "https://v2st81ure8.execute-api.ap-northeast-1.amazonaws.com/default/chatgptlog",
      {
        signal
      }
    );
    const json = await res.json();
    return {
      items: json.Items
    };
  }
  async function sort({ items, sortDescriptor }) {
    return {
      items: items.sort((a, b) => {
        let first = a[sortDescriptor.column];
        let second = b[sortDescriptor.column];
        let cmp = collator.compare(first, second);
        if (sortDescriptor.direction === "descending") {
          cmp *= -1;
        }
        return cmp;
      })
    };
  }
  const list = useAsyncList({ load, sort });
  return (
    <Table
      aria-label="Example static collection table"
      css={{ minWidth: "100%", height: "calc($space$14 * 10)" }}
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
    >
      <Table.Header>
        <Table.Column key="datetime" allowsSorting>
          datetime
        </Table.Column>
        <Table.Column key="username" allowsSorting>
          username
        </Table.Column>
        <Table.Column key="usermessage" allowsSorting>
          usermessage
        </Table.Column>
        <Table.Column key="fubukimessage" allowsSorting>
          fubukimessage
        </Table.Column>
      </Table.Header>
      <Table.Body items={list.items} loadingState={list.loadingState}>
        {(item) => (
          <Table.Row key={item.datetime}>
            {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
          </Table.Row>
        )}
      </Table.Body>
      <Table.Pagination
        shadow
        noMargin
        align="center"
        rowsPerPage={5}
        onPageChange={(page) => console.log({ page })}
      />
    </Table>
  );
}
