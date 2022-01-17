import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinkIcon from '@mui/icons-material/Link';
import Link from 'next/link';

const tags = (tags: string[]) => {
    let asd = tags.map(tag => {
        <Button size="small">#{tag}</Button>
    })
    return asd
}

export default function OutlinedCard(props) {
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" component="div">
                        File Name: {props.file}
                    </Typography>
                    <Typography variant="body2">
                        Created At: {props.createdAt}
                    </Typography>
                    <Typography variant="body2">
                        Size: {props.size}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button>
                        <Link href={`/notes/${props.file}`}>
                            Go to file
                        </Link>
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}
