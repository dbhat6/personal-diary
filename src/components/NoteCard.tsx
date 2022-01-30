import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import PropTypes, { InferProps } from 'prop-types';

export default function OutlinedCard(props: InferProps<typeof OutlinedCard.propTypes>) {
    const body = props.body;
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" component="div">
                        {props.heading}
                    </Typography>
                    <TextField multiline rows={4} value={body} sx={{
                        my: 2,
                        display: 'flex'
                    }} />
                    <Typography variant="h5" component="div">
                        Created at: {props.createdAt}
                    </Typography>
                </CardContent>
                <CardActions>
                    {/* {tags(props.tags)} */}
                    {props.tags?.map((tag: string, index: number) =>
                        (<Button key={index} size="small">#{tag}</Button>)
                    )}
                </CardActions>
            </Card>
        </Box>
    );
}

OutlinedCard.propTypes = {
    body: PropTypes.string,
    heading: PropTypes.string,
    createdAt: PropTypes.string,
    tags: PropTypes.array,
}
