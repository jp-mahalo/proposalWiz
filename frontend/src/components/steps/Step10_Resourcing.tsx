import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Grid, TextField, Checkbox, FormControlLabel, Button,
  IconButton, RadioGroup, FormControl, FormLabel, Paper
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useWizardContext, Step10FormData, RoleResourcing } from '../../context/WizardContext';
import { standardRolesData, ProjectRole, teamLocationPreferencesData, TeamLocationPreference } from '../../data/resourcingOptions';

const Step10_Resourcing: React.FC = () => {
  const { formData, setFormData } = useWizardContext();
  const stepData = formData.step10 || { roles: [], customRoles: [] };

  // Initialize state for predefined roles
  const initialRolesState = standardRolesData.map(role => {
    const existingRole = stepData.roles?.find(r => r.roleId === role.id);
    return existingRole || { roleId: role.id, roleName: role.name, quantity: '', fte: '', isSelected: false };
  });
  const [roles, setRoles] = useState<RoleResourcing[]>(initialRolesState);

  const [customRoles, setCustomRoles] = useState<RoleResourcing[]>(stepData.customRoles || []);
  const [teamLocationPreference, setTeamLocationPreference] = useState(stepData.teamLocationPreference || '');

  useEffect(() => {
    const reInitialRolesState = standardRolesData.map(role => {
        const existingRole = formData.step10?.roles?.find(r => r.roleId === role.id);
        return existingRole || { roleId: role.id, roleName: role.name, quantity: '', fte: '', isSelected: false };
    });
    setRoles(reInitialRolesState);
    setCustomRoles(formData.step10?.customRoles || []);
    setTeamLocationPreference(formData.step10?.teamLocationPreference || '');
  }, [formData.step10]);


  const updateContext = (updatedFields: Partial<Step10FormData>) => {
    setFormData(prev => ({
      ...prev,
      step10: { ...(prev.step10 || { roles: [], customRoles:[] }), ...updatedFields } as Step10FormData,
    }));
  };

  const handleRoleSelectionChange = (index: number, isSelected: boolean) => {
    const updatedRoles = [...roles];
    updatedRoles[index].isSelected = isSelected;
    if (!isSelected) { // Clear quantity and FTE if deselected
      updatedRoles[index].quantity = '';
      updatedRoles[index].fte = '';
    }
    setRoles(updatedRoles);
    updateContext({ roles: updatedRoles.filter(r => r.isSelected) }); // Only store selected roles in context
  };

  const handleRoleInputChange = (index: number, field: 'quantity' | 'fte', value: string) => {
    const updatedRoles = [...roles];
    updatedRoles[index][field] = value;
    setRoles(updatedRoles);
    updateContext({ roles: updatedRoles.filter(r => r.isSelected) });
  };

  const handleCustomRoleChange = (index: number, field: 'roleName' | 'quantity' | 'fte', value: string) => {
    const updatedCustomRoles = [...customRoles];
    updatedCustomRoles[index] = { ...updatedCustomRoles[index], [field]: value };
    setCustomRoles(updatedCustomRoles);
    updateContext({ customRoles: updatedCustomRoles });
  };

  const addCustomRole = () => {
    const newCustomRoles = [...customRoles, { roleId: `custom_${Date.now()}`, roleName: '', quantity: '', fte: '' }];
    setCustomRoles(newCustomRoles);
    updateContext({ customRoles: newCustomRoles });
  };

  const removeCustomRole = (index: number) => {
    const updatedCustomRoles = customRoles.filter((_, i) => i !== index);
    setCustomRoles(updatedCustomRoles);
    updateContext({ customRoles: updatedCustomRoles });
  };

  const handleLocationPreferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTeamLocationPreference(value);
    updateContext({ teamLocationPreference: value });
  };


  return (
    <Box>
      <Typography variant="h6" gutterBottom>Resourcing Requirements</Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Define the roles, their quantity, and FTE % for the project.
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Standard Roles</Typography>
        {roles.map((role, index) => (
          <Grid container spacing={2} key={role.roleId} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={12} sm={4} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={role.isSelected || false}
                    onChange={(e) => handleRoleSelectionChange(index, e.target.checked)}
                  />
                }
                label={role.roleName}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                label="Quantity"
                type="number"
                size="small"
                value={role.quantity}
                onChange={(e) => handleRoleInputChange(index, 'quantity', e.target.value)}
                disabled={!role.isSelected}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                label="FTE %"
                type="number"
                size="small"
                value={role.fte}
                onChange={(e) => handleRoleInputChange(index, 'fte', e.target.value)}
                disabled={!role.isSelected}
                fullWidth
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>
          </Grid>
        ))}
      </Paper>

      <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Custom Roles</Typography>
        {customRoles.map((customRole, index) => (
          <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                label="Role Name"
                size="small"
                value={customRole.roleName}
                onChange={(e) => handleCustomRoleChange(index, 'roleName', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={5} sm={3} md={2}>
              <TextField
                label="Quantity"
                type="number"
                size="small"
                value={customRole.quantity}
                onChange={(e) => handleCustomRoleChange(index, 'quantity', e.target.value)}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={5} sm={3} md={2}>
              <TextField
                label="FTE %"
                type="number"
                size="small"
                value={customRole.fte}
                onChange={(e) => handleCustomRoleChange(index, 'fte', e.target.value)}
                fullWidth
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>
            <Grid item xs={2} sm={2} md={1}>
              <IconButton onClick={() => removeCustomRole(index)} color="error">
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button startIcon={<AddCircleOutlineIcon />} onClick={addCustomRole} sx={{ mt: 1 }}>
          Add Custom Role
        </Button>
      </Paper>

      <FormControl component="fieldset" margin="normal" fullWidth sx={{mt:3}}>
        <FormLabel component="legend">Team Location Preference</FormLabel>
        <RadioGroup row value={teamLocationPreference} onChange={handleLocationPreferenceChange}>
          {teamLocationPreferencesData.map((loc: TeamLocationPreference) => (
            <FormControlLabel key={loc.id} value={loc.id} control={<Radio />} label={loc.name} />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default Step10_Resourcing;
