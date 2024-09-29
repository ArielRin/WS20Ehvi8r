import React, { useState, useEffect } from 'react';
import { Box, Image, Flex, Text } from '@chakra-ui/react';
import { css, keyframes } from '@emotion/react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom



import Presalecomponent from './Presalecomponent';


const NewPage = () => {



  return (
    <>
      <Box
        position="relative"
        flex={1}
        p={0}
        m={0}
        display="flex"
        flexDirection="column"
        color="white"
      >
        <video
          autoPlay
          loop
          muted
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            objectFit: 'cover',
            zIndex: -2
          }}
        >
          <source src="" type="video/mp4" />
        </video>

        <Box
          flex={1}
          p={0}
          m={0}
          bg="rgba(0, 0, 0, 0.65)"
          display="flex"
          flexDirection="column"
          color="white"
          >

                    <Flex p={2} bg="rgba(0, 0, 0, 0.61)" justify="space-between" align="center">
                      <Link to="/">
                        <Image p={2} ml="4" src="images/logobwb.png" alt="Heading" width="200px" />
                      </Link>
                      <Flex   align="right">

                      <w3m-button />
                    </Flex>
                    </Flex>

          <Box
            flex={1}
            p={0}
            m={0}
            display="flex"
            flexDirection="column"
            bgPosition="center"
            bgRepeat="no-repeat"
            bgSize="cover"
            color="white"
          >
          <Flex
            flex={1}
            m={2}
            p={7}
            borderRadius="2xl"
            textAlign="center"
            bg="rgba(0, 0, 0, 0.61)"
            border="2px"
            borderColor="#fff"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center" // Center items horizontally
            h="auto" // Allow height to adjust based on content
            flexDirection="column" // Stack items vertically
          >
            <Image
              src="/images/claimbd.png"
              alt="header"
              mx="auto"
              width="30%"
              minW="200px"
              mt="28px"
            />

            <Text
              mb={2}
              ml={4}
              mx="auto"
              textAlign="center"
              fontSize="lg"
              fontWeight="bolder"
            >
            </Text>

            <Flex justifyContent="center" mt={4}>
              <w3m-network-button />
            </Flex>
          </Flex>


          <Box
            flex={1}
            m={2}
            borderRadius="2xl"
            boxShadow="md"
            textAlign="center"
            border="2px"
            borderColor="#fff"
          >
          <Presalecomponent/>

          </Box>




            <Flex justifyContent="center" p={0} flexWrap="wrap" position="relative">

            {/*///////////////////////////////*/}


            <Box
              flex={1}
              minW="300px"
              m={2}
              p={7}
              borderRadius="2xl"
              boxShadow="md"
              textAlign="center"
              bg="rgba(0, 0, 0, 0.61)"
              border="2px"
              borderColor="#fff"
            >
              <Link to="/">
              <Text
          textAlign="center"
          color="white"
          fontSize="4xl"
          fontWeight="bolder"
          >
          Presale
          </Text>
                <Image src="images/logobwb.png" alt="header" mx="auto" width="40%" minW="250px" mt="28px" />


                  <Flex justifyContent="center" flexWrap="wrap">
                    <Text mt="10px" width="60%" textAlign="center" fontSize="lg" fontWeight="normal">

                    </Text>
                  </Flex>

                  <Flex justifyContent="center" flexWrap="wrap">
                  <Text width="60%" textAlign="center" fontSize="lg" fontWeight="normal">
                  </Text>
                </Flex>


              </Link>
            </Box>


            {/*///////////////////////////////*/}


                            {/*///////////////////////////////*/}

            </Flex>

          </Box>
        </Box>
      </Box>





    </>
  );
};

export default NewPage;
