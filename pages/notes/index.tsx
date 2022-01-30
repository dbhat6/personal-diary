import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FileCard from '../../src/components/FileCard';

const Notes = ({ files }: { files: any }): React.ReactElement => {
    console.log(files)
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                {files.length > 0 ? files.map((file: any, index: number) => (
                    <FileCard key={index} file={file.file} createdAt={file.createdAt} size={file.size} />
                )) : (<Typography variant="h2" gutterBottom component="div" sx={{ mx: 15 }} >Nothing to display here</Typography>)}
            </Box>


        </Container>
    );
};

export async function getServerSideProps() {
    // Call an external API endpoint to get notes
    const res = await fetch('http://localhost:3000/api/notes')
    const files = await res.json()

    // By returning { props: { notes } }, the Blog component
    // will receive `notes` as a prop at build time
    return {
        props: {
            files: files.files,
        },
    }
}

export default Notes;
