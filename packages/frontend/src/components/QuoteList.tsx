import * as React from "react";
import { useQuery, gql } from "@apollo/client";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
} from "@material-ui/core";

const GET_DOGS = gql`
  query GET {
    quotes {
      id
      content
      author {
        id
        name
      }
    }
  }
`;

export interface Quote {
  content: string;
  author: Author;
}

export interface Author {
  name: string;
}

export default function QuoteList(): React.ReactElement {
  const { loading, error, data } = useQuery(GET_DOGS);

  if (loading) return <>Loading...</>;
  if (error) return <>Error! {error.message}</>;

  return (
    <List>
      {data.quotes.map(({ content, author }: Quote) => (
        <>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="../../public/img/einstein.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={author.name}
              secondary={<React.Fragment>{content}</React.Fragment>}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      ))}
    </List>
  );
}
